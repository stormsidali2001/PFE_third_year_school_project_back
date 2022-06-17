import { HttpException, HttpStatus, Injectable, Logger, Post } from "@nestjs/common";
import { NormalTeamMeetDto, SoutenanceDto, StudentDTO, SurveyDto , TeamAnnoncementDocDto, ThemeDocDto, ThemeToTeamDTO, UrgentTeamMeetDto, WishListDTO } from "src/core/dtos/user.dto";
import { AnnouncementEntity } from "src/core/entities/announcement.entity";
import { InvitationEntity } from "src/core/entities/invitation.entity";
import { NotificationEntity } from "src/core/entities/Notification.entity";
import { StudentEntity } from "src/core/entities/student.entity";
import { SurveyEntity } from "src/core/entities/survey.entity";
import { SurveyOptionEntity } from "src/core/entities/survey.option.entity";
import { SurveyParticipantEntity } from "src/core/entities/survey.participant.entity";
import { TeamChatMessageEntity } from "src/core/entities/team.chat.message.entity";
import { TeamEntity } from "src/core/entities/team.entity";
import { UserEntity, UserType } from "src/core/entities/user.entity";
import { getConnection, getManager } from "typeorm";
import {SchedulerRegistry} from '@nestjs/schedule'
import { CronJob } from "cron";
import { MeetEntity, MeetType } from "src/core/entities/meet.entity";
import { SocketService } from "src/socket/socket.service";
import { Server } from 'ws';
import { AnnouncementDocumentEntity } from "src/core/entities/announcement.document.entity";
import { TeamRepository } from "src/core/repositories/team.list.repository";
import { TeamDocumentEntity } from "src/core/entities/team.document.entity";
import * as fs from 'fs';
import * as path from "path";
import { TeacherEntity } from "src/core/entities/teacher.entity";
import { AdminEntity } from "src/core/entities/admin.entity";
import { EntrepriseEntity } from "src/core/entities/entreprise.entity";
import { ConfigEntity } from "src/core/entities/config.entity";
import { ThemeEntity } from "src/core/entities/theme.entity";
import { PromotionEntity } from "src/core/entities/promotion.entity";
import { WishEntity } from "src/core/entities/wish.entity";
import { DocumentTypeEntity } from "src/core/entities/document-types.entity";
import { SalleEntity } from "src/core/entities/salle.entity";

@Injectable()
export class UserService{
    constructor(private schedulerRegistry: SchedulerRegistry,
                private socketService:SocketService){}
    
    async getUserInfo(userId:string){
        const manager = getManager();
        const userRepository = manager.getRepository(UserEntity);
        
        try{
            const user = await userRepository.createQueryBuilder('user')
            .where('user.id = :userId',{userId})
            .getOne()
            if(!user){
                Logger.log("user not found","userService/getUserInfo")
                throw new HttpException("user not found",HttpStatus.FORBIDDEN)
            }

            let entity:StudentEntity | TeacherEntity |AdminEntity | EntrepriseEntity;
    
            if(user.userType === UserType.STUDENT){
             entity = await getManager().getRepository(StudentEntity).createQueryBuilder('student')
             .where('student.userId = :userId',{userId})
             .leftJoinAndSelect('student.team','team')
             .leftJoinAndSelect('team.teamLeader','teamLeader')
             .leftJoinAndSelect('student.promotion','promotion')
             .getOne()
             
            }else if(user.userType === UserType.ADMIN){
                entity = await getManager().getRepository(AdminEntity).createQueryBuilder('admin')
                .where('admin.userId = :userId',{userId:user.id})
                .getOne()
            }else if(user.userType === UserType.TEACHER){
                entity = await getManager().getRepository(TeacherEntity).createQueryBuilder('teacher')
                .where('teacher.userId = :userId',{userId:user.id})
                .getOne()


            }else if(user.userType === UserType.ENTERPRISE){

            }
            const responseObj = {
                userType:user.userType,
                email:user.email,
                [`${user.userType}`]:{
                    ...entity,

                }
            }
           
            return responseObj;
    
           }catch(err){
            Logger.error(err,"userService/getUserInfo")
            throw new HttpException(err,HttpStatus.INTERNAL_SERVER_ERROR)
           }
    }
    /*
     * team leader/student sends an invitation  to a student without a team
     * 
     */
   async _sendNotficationStudent(studentId:string,description:string){          
       // get the notification repository
         const manager = getManager();
            //get student repository    
            const studentRepository = manager.getRepository(StudentEntity);
            const student = await studentRepository.createQueryBuilder('student')
            .where('student.id = :studentId',{studentId})
            .leftJoinAndSelect('student.user','user')
            .getOne()
        
            if(!student){
                Logger.error("student not found",'UserService/sendNotfication') 
                throw new HttpException("student not found",HttpStatus.BAD_REQUEST);
            }
            const notificationRepository = manager.getRepository(NotificationEntity);
            const notification = notificationRepository.create({description,user:student.user,seen:false});
            await notificationRepository.save(notification);
            const socket = this.socketService.socket as Server;
            socket.to(student.user.id).emit("new_notification",notification)
            return `notification sent with success to: ${student.firstName+' '+student.lastName}`;
            
}  
    async _sendTeamNotfication(teamId:string,description:string,expectStudentId?:string,expectMessage?:string){    
        const manager = getManager();
        const teamRepository = manager.getRepository(TeamEntity);
        const team = await teamRepository.createQueryBuilder('team')
        .where('team.id = :teamId',{teamId})
        .leftJoinAndSelect('team.students','student')
        .leftJoinAndSelect('student.user','user')
        .getOne();
        
        if(!team){
            Logger.error("the student is not a member in a team",'UserService/sendTeamNotfication')
            throw new HttpException("the student is not a member in a team",HttpStatus.BAD_REQUEST);
        }
        const notificationRepository = manager.getRepository(NotificationEntity);

        const notifications:NotificationEntity[] = [];
        for(let student of team.students){
            if(expectStudentId && student.id === expectStudentId){   

                if(expectMessage){  
                    const notification = notificationRepository.create({description:expectMessage,user:student.user,seen:false});
                    notifications.push(notification);
                   
                }
                continue;   
            }

            const notification = notificationRepository.create({description,user:student.user,seen:false});
            notifications.push(notification);
          
        }
        await notificationRepository.save(notifications)
        const socket = this.socketService.socket as Server;
        
        notifications.forEach((nf,index)=>{
            Logger.error(`notification sent ${index}`,"Notification")
            socket.to(nf.user.id).emit("new_notification",nf)

        })
       
        return `notification sent with success to team: ${team.nickName} members` ;   
    }
 async _sendNotfication(userId:string,description:string){          
       // get the notification repository
         const manager = getManager();
            //get student repository    
            const userRepository = manager.getRepository(UserEntity);
            const user = await userRepository.createQueryBuilder('user')
            .where('user.id = :userId',{userId})
            .getOne()
        
            if(!user){
                Logger.error("user not found",'UserService/sendNotfication') 
                throw new HttpException("user not found",HttpStatus.BAD_REQUEST);
            }
            const notificationRepository = manager.getRepository(NotificationEntity);
            const notification = notificationRepository.create({description,user,seen:false});
            await notificationRepository.save(notification);
            const socket = this.socketService.socket as Server;
            Logger.error(`emit to ${userId}  event new_notification`,"debugggggg")
            socket.to(userId).emit("new_notification",notification)
            return `notification sent with `;
            
}  
    //the number param has an undefined or number type
async  getLastNotifications(userId:string,number:number = undefined){   

    try{


        // get the notification repository
        const manager = getManager();
     
       
        Logger.error(`notifications ${userId}`,'UserService/getNotifications')
        //get student repository
        const notificationRepository = manager.getRepository(NotificationEntity);
      const notifications = await   notificationRepository.createQueryBuilder('notification')
        .innerJoin('notification.user','user')
        .where('user.id = :userId',{userId})
        .orderBy('notification.createdAt',"DESC")
        .getMany();
     const totalNotificationCount = await notificationRepository.createQueryBuilder('notification')
     .innerJoin('notification.user','user')
     .where('user.id = :userId',{userId})
     .getCount();
    
      
    //   Logger.log('notifications:'+JSON.stringify(notifications))
      return {notifications,totalNotificationCount};
    }catch(err){
        Logger.error(err,'UserService/getNotifications')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);

    }
}

//crud operations student----------------------------------------
async getStudents(){
    try{
        const manager = getManager();
        const studentRepository = manager.getRepository(StudentEntity);
        const students =  await studentRepository.createQueryBuilder('students')
        .leftJoinAndSelect('students.promotion','promotion')
        .getMany();

        return students;
    }catch(err){
        Logger.error(err,'UserService/getStudents')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);
    }
}
async deleteStudent(studentId:string){
    try{
        const manager = getManager();
        const studentRepository = manager.getRepository(StudentEntity);

      await studentRepository.createQueryBuilder('students')
       .delete()
       .where('student.id = :studentId',{studentId}).execute()

        return "deleted!!"
    }catch(err){
        Logger.error(err,'UserService/deleteStudent')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);
    }
}
async editStudent(studentId:string,data:Partial<StudentEntity>){
    try{
        const manager = getManager();
        const studentRepository = manager.getRepository(StudentEntity);

      await studentRepository.createQueryBuilder('students')
       .update()
       .set(data)
       .where('students.id = :studentId',{studentId}).execute()
        return "updated !!"
    }catch(err){
        Logger.error(err,'UserService/editStudent')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);
    }
}
//crud operations Teacher----------------------------------------
async getTeachers(){
    try{
        const manager = getManager();
        const teacherRepository = manager.getRepository(TeacherEntity);

        const teachers:TeacherEntity[] =  await teacherRepository.createQueryBuilder('teachers')
        .getMany();
       

        return teachers;
    }catch(err){
        Logger.error(err,'UserService/getTeachers')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);
    }
}
async deleteTeacher(teacherId:string){
    try{
        const manager = getManager();
        const teacherRepository = manager.getRepository(TeacherEntity);

      await teacherRepository.createQueryBuilder()
       .delete()
       .where('teacher.id = :teacherId',{teacherId}).execute()

        return "deleted!!"
    }catch(err){
        Logger.error(err,'UserService/deleteTeacher')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);
    }
}
async editTeacher(teacherId:string,data:Partial<TeacherEntity>){
    try{
        const manager = getManager();
        const teacherRepository = manager.getRepository(TeacherEntity);

      await teacherRepository.createQueryBuilder('teachers')
       .update()
       .set(data)
       .where('teachers.id = :teacherId',{teacherId}).execute()
        return "updated !!"
    }catch(err){
        Logger.error(err,'UserService/editTeacher')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);
    }
}
//wish list 
async sendWishList(userId:string,promotionId:string){
    try{
        const manager = getManager();
        const user = manager.getRepository(UserEntity)
        .createQueryBuilder('user')
        .where("user.id = :userId",{userId})
        .andWhere("user.userType = :userType",{userType:UserType.ADMIN})
        .getOne();
        const promotion = await manager.getRepository(PromotionEntity)
        .createQueryBuilder('promotion')
        .where('promotion.id = :promotionId',{promotionId})
        .leftJoinAndSelect("promotion.teams","team")
        .loadRelationCountAndMap("team.membersCount","team.students")
        .getOne();

        if(!user){
            Logger.log("permission denied","UserService/submitWishList")
            throw new HttpException("permission denied",HttpStatus.BAD_REQUEST)
        } 
        if(!promotion){
            Logger.log("promotion not found","UserService/submitWishList")
            throw new HttpException("promotion not found",HttpStatus.BAD_REQUEST)
        }  
    
      
       const allTeamsAreValid =  promotion.teams.every(team=>{
            //@ts-ignore
            return  team.membersCount >= promotion.minMembersInTeam && team.membersCount <= promotion.maxMembersInTeam
            
        })
        if(!allTeamsAreValid){
            Logger.log("il existe des equipe non valide","UserService/submitWishList")
            throw new HttpException("il existe des equipe non valide",HttpStatus.BAD_REQUEST)
        }

        const students = await manager.getRepository(StudentEntity)
        .createQueryBuilder('student')
        .where('student.promotionId = :promotionId',{promotionId})
        .andWhere('student.teamId IS NULL')
        .getMany();
        if(students?.length >0){
            Logger.log("il existe des etudiants sans equipes","UserService/submitWishList")
            throw new HttpException("il existe des etudiants sans equipes",HttpStatus.BAD_REQUEST)
        }





     return   await manager.getRepository(PromotionEntity)
        .createQueryBuilder('promotion')
        .update()
        .set({wishListSent:true})
        .where('promotion.id = :pomotionId',{promotionId})
        .execute();  

    }catch(err){
        Logger.log(err,"UserService/submitWishList")
        throw new HttpException(err,HttpStatus.BAD_REQUEST)
    }
  
}
async submitWishList(userId:string,wishList:WishListDTO){
try{
    const manager = getManager();
    Logger.error(wishList,'DEbuuuug')

    const student = await manager.getRepository(StudentEntity)
    .createQueryBuilder('student')
    .where("student.userId = :userId",{userId})
    .innerJoinAndSelect('student.team','team')
    .innerJoinAndSelect('team.teamLeader','teamLeader')
    .andWhere('teamLeader.id = student.id')
    .leftJoinAndSelect('student.promotion','promotion')
    .leftJoinAndSelect('promotion.themes','themes')
    .andWhere('themes.validated = true')
    .getOne();
  

   
  
    if(!student){
        Logger.error("Permission denied",'UserService/submitWishList')
        throw new HttpException("Permission denied",HttpStatus.BAD_REQUEST);
    }
       
    const wish = await manager.getRepository(WishEntity)
    .createQueryBuilder('wish')
    .where('wish.teamId IS NOT NULL and wish.teamId = :teamId',{teamId:student.team.id})
    .getOne()
    if(wish){
        Logger.error("your team already submeted the wish list",'UserService/submitWishList')
        throw new HttpException("your team already submeted the wish list",HttpStatus.BAD_REQUEST);
    }
    const {wishes} = wishList;
   
    if(wishes?.length ==0){
        Logger.error("wishes not found",'UserService/submitWishList')
        throw new HttpException("wishes not found",HttpStatus.BAD_REQUEST);

    }
     const newWishList =[]
    

     const themeIds = wishes.map(el=>el.themeId);
    
    
        
        const themes = await manager.getRepository(ThemeEntity)
        .createQueryBuilder('theme')
        .where('theme.id  in (:...themeIds)',{themeIds:themeIds})
        .getMany();
     
       
        if(themeIds.length !== student.promotion.themes.length){
            Logger.error("wrong number of themes",'UserService/submitWishList')
            throw new HttpException("wrong number of themes",HttpStatus.BAD_REQUEST);
        }


        wishes.forEach( async (el,index)=>{
          
          
    
    
             newWishList.push({
                order:el.order,
                team:student.team,
                theme:themes[index]
                
            }) 
    
      
    
         
     })
      
     await manager.getRepository(WishEntity)
     .save(newWishList)

}catch(err){
    Logger.error(err,'UserService/submitWishList')
    throw new HttpException(err,HttpStatus.BAD_REQUEST);
}
}




//team crud operations
async getTeams(promotionId:string){
    try{
        const manager = getManager();
        let query =  manager.getRepository(TeamEntity)
        .createQueryBuilder('team')
        .leftJoinAndSelect('team.givenTheme','givenTheme')
        .loadRelationCountAndMap('team.membersCount','team.students')
        .leftJoinAndSelect('team.promotion','promotion')
       
        if(promotionId !=='all'){
            query = query.where('promotion.id = :promotionId',{promotionId})
        }

        const teams = await query.getMany()
        
        //@ts-ignore
        return teams.map(({nickName,givenTheme,membersCount,id,promotion,peutSoutenir})=>{
           Logger.error(nickName,promotion,"debug")
            return {
                id,
                pseudo:nickName,
                theme:givenTheme,
                nombre:membersCount,
                promotion:promotion.name,
                complete: membersCount >= promotion.minMembersInTeam && membersCount <=  promotion.maxMembersInTeam,
                peut_soutenir:peutSoutenir
            }
        });
    }catch(err){
        Logger.error(err,'UserService/getTeams')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);
    }


}


async getTeam(teamId){
    try{
        const manager = getManager();
        const team = await manager.getRepository(TeamEntity)
        .createQueryBuilder('team')
        .where('team.id = :teamId',{teamId})
        .leftJoinAndSelect('team.givenTheme','givenTheme')
        .leftJoinAndSelect('team.students','members')
        .leftJoinAndSelect('team.promotion','promotion')
        .leftJoinAndSelect('team.teamLeader','leader')
        .getOne();
        
        //@ts-ignore
            const {id,nickName,givenTheme,students,promotion,teamLeader,peutSoutenir} = team;
            return {
                id,
                pseudo:nickName,
                theme:givenTheme,
                members:students,
                promotion:promotion,
                validated: students.length >= promotion.minMembersInTeam &&  students.length <=  promotion.maxMembersInTeam,
                teamLeader,
                peut_soutenir:peutSoutenir,
            }
     
    }catch(err){
        Logger.error(err,'UserService/getTeam')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);
    }
  
}
//messages crud operations




async createNewConfig(key:string,value:string){
    try{
        const manager = getManager();
        const sql =   manager.getRepository(ConfigEntity)
         .createQueryBuilder()
         .insert()
         .values({key,value}).getSql()
     
         await manager.getRepository(ConfigEntity)
         .createQueryBuilder()
         .insert()
         .values({key,value})
         .execute()

         Logger.error(sql,"userService/createNewConfig")

    }catch(err){
        Logger.error(err,'UserService/createNewConfig')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);

    }  
}

//promotion
async createNewPromotion(name:string,documentTypes:string[]){
    try{
        const manager = getManager();
      
        await getConnection().transaction(async manager =>{
            const promotion =  manager.getRepository(PromotionEntity).create({name})
            await manager.getRepository(PromotionEntity)
            .createQueryBuilder()
            .insert()
            .values(promotion)
            .execute();
            let docTypes:DocumentTypeEntity[] = [];
        
            const docType =  manager.getRepository(DocumentTypeEntity).create({name:'autres',promotion})
                docTypes.push(docType)
            for(let k in documentTypes){
                const docnName = documentTypes[k]
                const docType =  manager.getRepository(DocumentTypeEntity).create({name:docnName,promotion})
                docTypes.push(docType)
            }


            await manager.getRepository(DocumentTypeEntity)
            .save(docTypes)
    
          
    

        })
      
    }catch(err){
        Logger.error(err,'UserService/createNewPromotion')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);

    }
}

async getAllPromotions(){
    try{
        const manager = getManager();

        return await manager.getRepository(PromotionEntity)
        .createQueryBuilder()
        .getMany()

    }catch(err){
        Logger.error(err,'UserService/getAllPromotions')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);

    }

}
async getPromotionDocumentTypes(userId:string){
    try{
        const manager = getManager();
        const student = await manager.getRepository(StudentEntity)
        .createQueryBuilder('student')
        .where('student.userId = :userId',{userId})
        .leftJoinAndSelect('student.promotion','promotion')
        .leftJoinAndSelect('promotion.documentTypes','documentTypes')
        .getOne()

        if(!student){
            Logger.error("permession denied",'UserService/getPromotionDocumentTypes')
            throw new HttpException("permession denied",HttpStatus.BAD_REQUEST);
        }
     
        return student.promotion.documentTypes;

    }catch(err){
        Logger.error(err,'UserService/getPromotionDocumentTypes')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);

    }

}
@Post('getSalles')
async getSalles(){
    try{
        const manager = getManager()

        const salles = await manager.getRepository(SalleEntity)
        .createQueryBuilder('salles')
        .getMany();

        return salles;

    }catch(err){
        Logger.log(err,'UserService/getSalles')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);
    }
}

async careateSalle(name:string){
    try{
        const manager = getManager()

       await manager.getRepository(SalleEntity)
        .createQueryBuilder('salle')
        .insert()
        .values({name})
        .execute()

       

    }catch(err){
        Logger.log(err,'UserService/getSalles')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);
    }
}
async getTeamsithThemes(promotionId:string){
    try{
        const manager = getManager();
        let query =  manager.getRepository(TeamEntity)
        .createQueryBuilder('team')
        .where('team.peutSoutenir = true')
        .innerJoinAndSelect('team.givenTheme','givenTheme')
        .leftJoinAndSelect('team.promotion','promotion')
       
        if(promotionId !=='all'){
            query = query.where('promotion.id = :promotionId',{promotionId})
        }

        const teams = await query.getMany()
        
        //@ts-ignore
        return teams.map(({nickName,givenTheme,membersCount,id,promotion})=>{
           Logger.error(nickName,promotion,"debug")
            return {
                id,
                pseudo:nickName,
                theme:givenTheme,
                nombre:membersCount,
                promotion:promotion.name,
                validated: membersCount >= promotion.minMembersInTeam && membersCount <=  promotion.maxMembersInTeam
            }
        });
    }catch(err){
        Logger.error(err,'UserService/getTeams')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);
    }
}

}

