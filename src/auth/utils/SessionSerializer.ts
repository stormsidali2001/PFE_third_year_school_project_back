import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { AdminEntity } from "src/core/entities/admin.entity";
import { EntrepriseEntity } from "src/core/entities/entreprise.entity";
import { StudentEntity } from "src/core/entities/student.entity";
import { TeacherEntity } from "src/core/entities/teacher.entity";
import { UserEntity, UserType } from "src/core/entities/user.entity";
import { getManager } from "typeorm";

@Injectable()
export class SessionSerializer extends PassportSerializer{
    
    serializeUser(user: any, done: Function) {
        Logger.log("Serializing user ...","SessionSerializer/serializeUser")
        
        done(null,user)
      
    }
   async deserializeUser(user: any, done: Function) {
       Logger.log("Serializing user ...","SessionSerializer/deserializeUser")
       try{
        const userDb = await getManager().getRepository(UserEntity).createQueryBuilder('user')
        .where('user.id = :userId',{userId:user.id})
        .getOne()
        if(!userDb){
            return done(null,null);
        }
        let entity:StudentEntity | TeacherEntity |AdminEntity | EntrepriseEntity;

        if(userDb.userType === UserType.STUDENT){
         entity = await getManager().getRepository(StudentEntity).createQueryBuilder('student')
         .where('student.userId = :userId',{userId:user.id})
         .leftJoinAndSelect('student.team','team')
         .leftJoinAndSelect('team.teamLeader','teamLeader')
         .getOne()
         
        }
        const responseObj = {
            userType:userDb.userType,
            [`${userDb.userType}`]:{
                ...entity
            }
        }
       
        return done(null,responseObj);

       }catch(err){
        Logger.error(err,"SessionSerializer/deserializeUser")
        throw new HttpException(err,HttpStatus.INTERNAL_SERVER_ERROR)
       }
     
    }
  
}