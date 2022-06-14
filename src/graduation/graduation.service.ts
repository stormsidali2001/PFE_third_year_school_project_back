import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { SoutenanceDto } from "src/core/dtos/user.dto";
import { Jury_of } from "src/core/entities/juryOf.entity";
import { SalleEntity } from "src/core/entities/salle.entity";
import { SoutenanceEntity } from "src/core/entities/soutenance.entity";
import { TeacherEntity } from "src/core/entities/teacher.entity";
import { TeamEntity } from "src/core/entities/team.entity";
import { UserEntity, UserType } from "src/core/entities/user.entity";
import { getConnection, getManager } from "typeorm";




@Injectable()
export class GraduationService{
    async createSoutenance(userId:string,data:SoutenanceDto){
        const {
            title,
            description,
            date,
            jurysIds,
            salleId,
            teamId,
            duration
        } = data;
        try{
            const manager = getManager();
    
            const user = await manager.getRepository(UserEntity)
            .createQueryBuilder('user')
            .where('user.id = :userId and user.userType = :userType',{userId,userType:UserType.ADMIN})
            .getOne();
    
            if(!user){
                Logger.error("permission denied",'UserService/createSoutenance')
                throw new HttpException("permission denied",HttpStatus.BAD_REQUEST);
            }
            const salle = await manager.getRepository(SalleEntity)
            .createQueryBuilder('salle')
            .where('salle.id = :salleId',{salleId})
            .getOne();
            if(!salle){
                Logger.error("salle not found",'UserService/createSoutenance')
                throw new HttpException("salle not found",HttpStatus.BAD_REQUEST);
            }
            const jurys = await manager.getRepository(TeacherEntity)
            .createQueryBuilder('teacher')
            .where('teacher.id in (:...jurysIds)',{jurysIds})
            .getMany()
    
            if(jurys.length !== jurysIds.length){
                Logger.error("jurys not found",'UserService/createSoutenance')
                throw new HttpException("jurys not found",HttpStatus.BAD_REQUEST);
            }
            const team = await manager.getRepository(TeamEntity)
            .createQueryBuilder('team')
            .where('team.id = :teamId',{teamId})
            .getOne()
    
            if(!team){
                Logger.error("team not found",'UserService/createSoutenance')
                throw new HttpException("team not found",HttpStatus.BAD_REQUEST);
            }
            const soutenance =  await manager.getRepository(SoutenanceEntity)
            .createQueryBuilder('soutenance')
            .where('soutenance.teamId = :teamId',{teamId})
            .getOne()
            if(soutenance){
                Logger.error("soutenance already created for that team",'UserService/createSoutenance')
                throw new HttpException("soutenance already created for that team",HttpStatus.BAD_REQUEST);
            }
         
    
           await getConnection().transaction(async manager =>{
    
                await manager.getRepository(SoutenanceEntity)
                .createQueryBuilder('soutenance')
                .insert()
                .values({title,description,salle,date,team,duration})
                .execute()
        
                const insertedSoutenance = await manager.getRepository(SoutenanceEntity)
                .createQueryBuilder('soutenance')
                .where('soutenance.teamId = :teamId',{teamId})
                .getOne()
        
                await manager.getRepository(Jury_of)
                .createQueryBuilder('jf')
                .insert()
                .values(jurys.map(jr=>{
                    return {
                        teacher:jr,
                        soutenance:insertedSoutenance
                    }
                }))
                .execute()
            })
    
            return "done"
    
        }catch(err){
            Logger.error(err,'UserService/createSoutenance')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }
    async getSoutenance(soutenanceId:string){
    try{
        const manager = getManager();
    
     
        return await manager.getRepository(SoutenanceEntity)
        .createQueryBuilder('soutenance')
        .where('soutenance.id = :soutenanceId',{soutenanceId})
        .leftJoinAndSelect('soutenance.team','team')
        .leftJoinAndSelect('team.givenTheme','theme')
        .leftJoinAndSelect('soutenance.jurys','jurys')
        .leftJoinAndSelect('jurys.teacher','teacher')
        .leftJoinAndSelect('soutenance.salle','salle')
        .getOne()
    
    }catch(err){
        Logger.error(err,'UserService/getSoutenance')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);
    }
    }
    async getSoutenances(promotionId:string){
            try{
                const manager = getManager();
                let query =  manager.getRepository(SoutenanceEntity)
                .createQueryBuilder('soutenance')
                .leftJoinAndSelect('soutenance.team','team')
                .leftJoinAndSelect('soutenance.jurys','jurys')
                .leftJoinAndSelect('team.promotion','promotion')
                
                if(promotionId!=='all'){
                    query = query.where('promotion.id = :promotionId',{promotionId})
                }
            
                return await query.getMany()
            }catch(err){
                Logger.error(err,'UserService/getSoutenances')
                throw new HttpException(err,HttpStatus.BAD_REQUEST);
            }
        }
    
}