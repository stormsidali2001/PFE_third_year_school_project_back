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
      
            return done(null,user)
    }
  
}