import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { NormalTeamMeetDto, StudentDTO, SurveyDto , TeamAnnoncementDocDto, ThemeDocDto, ThemeToTeamDTO, UrgentTeamMeetDto, WishListDTO } from "src/core/dtos/user.dto";
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
import { ThemeDocumentEntity } from "src/core/entities/theme.document.entity";
import { PromotionEntity } from "src/core/entities/promotion.entity";
import {QueryBuilder} from  'typeorm'
import { WishEntity } from "src/core/entities/wish.entity";
import { EncadrementEntity } from "src/core/entities/encadrement.entity";
import { ResponsibleEntity } from "src/core/entities/responsible.entity";

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
    async sendATeamInvitation(userId:string,recieverId:string,description:string){
        try{
            const manager = getManager();
        
            /**
             * the sender can be:
             * 1-a team leader
             * 2-a student without a team (to form a team)
             */
            const sender =
            await manager.getRepository(StudentEntity)
            .createQueryBuilder('student')
            .leftJoinAndSelect('student.promotion','promotion')
            .where('student.userId = :userId',{userId})
            .getOne()
            
         
           
            
            if(!sender){
                Logger.error("sender not found",'UserService/sendATeamInvitation')
                throw new HttpException("sender not found",HttpStatus.BAD_REQUEST);
            }
            


            const reciever =  await manager.getRepository(StudentEntity)
            .createQueryBuilder('student')
            .leftJoinAndSelect('student.promotion','promotion')
            .where('student.teamId IS  NULL')
            .andWhere('student.id = :recieverId',{recieverId})
            .getOne()

            if(!reciever){
                Logger.error("reciever not found",'UserService/sendATeamInvitation')
                throw new HttpException("receiver not found",HttpStatus.BAD_REQUEST);
            }

            const sentInvitationCount= await manager.getRepository(InvitationEntity)
            .createQueryBuilder('invitation')
            .where('invitation.senderId = :senderId',{senderId:sender.id})
            .andWhere('invitation.recieverId = :recieverId',{recieverId})
            .getCount()

            if(sentInvitationCount!==0){
                Logger.error("you v'e already send an invitation to that particular user",'UserService/sendATeamInvitation')
                throw new HttpException("you v'e already send an invitation to that particular user",HttpStatus.BAD_REQUEST);
            }
            if(sender.promotion.id !== reciever.promotion.id){
                Logger.error("the sender and reciever should be in the same promotion",'UserService/sendATeamInvitation')
                throw new HttpException("the sender and reciever should be in the same promotion",HttpStatus.BAD_REQUEST);

            }
            const invitationsRepository = manager.getRepository(InvitationEntity);
            const invitation:InvitationEntity = invitationsRepository.create({description,sender,reciever});
            await invitationsRepository.save(invitation);
            return `Invitation sent succesfully to ${reciever.firstName} ${reciever.lastName} of the promotion ${sender.promotion.name}`;
        }catch(err){
            Logger.error(err,'UserService/sendATeamInvitation')
            throw new HttpException(err,HttpStatus.BAD_REQUEST)
        }



     
      

    }
        /*
         * the receiver of the invitation
         * 
         */
    async acceptRefuseTeamInvitation(invitationId:string,userId:string,accepted:boolean){
     
      
     
     
        
        try{
            let newTeamCreated = false;
            let invitation:InvitationEntity;

            let outputMessage = `invitation has been accepted`;
            await getConnection().transaction(async manager=>{
                const invitationsRepository = manager.getRepository(InvitationEntity);
              
           
             invitation = await invitationsRepository
             .createQueryBuilder('invitation')
             .leftJoinAndSelect('invitation.sender','sender')
             .leftJoinAndSelect('invitation.reciever','reciever')
             .leftJoinAndSelect('sender.team','steam')
             .leftJoinAndSelect('reciever.team','rteam')
             .leftJoinAndSelect('sender.promotion','spromotion')
             .where('invitation.id = :invitationId',{invitationId})
             .andWhere('reciever.userId = :userId',{userId})
             .getOne()
            

         
         
        if(!invitation){
            Logger.error("invitation not found",'UserService/getAcceptRefuseTeamInvitation')
            throw new HttpException("invitation not found",HttpStatus.FORBIDDEN);
        }

      
      
      if(!accepted){
          /*
            either a teamLeader or a student  refused the invitation
          */
          await invitationsRepository.delete({id:invitation.id})
          this._sendNotficationStudent(invitation.sender.id,`${invitation.reciever.firstName} ${invitation.reciever.lastName} refused your invitation `)
          return "the invitation has been refused";
          
      }
      
       
        const teamRepository = manager.getRepository(TeamEntity);
      
     
      
        const studentRepository = manager.getRepository(StudentEntity);
     
      
        if(!invitation.sender.team){
           
            const teamLength:number = await teamRepository
            .createQueryBuilder('team')
            .getCount()


           
           
            newTeamCreated = true;
            const newTeam = teamRepository.create({nickName:'team'+teamLength,teamLeader:invitation.sender,promotion:invitation.sender.promotion});
            await teamRepository.save(newTeam);
            invitation.reciever.team = newTeam;
            invitation.sender.team = newTeam;
            await studentRepository.save(invitation.reciever);
            await studentRepository.save(invitation.sender);



        }else{
           
            invitation.reciever.team = invitation.sender.team;
            await studentRepository.save(invitation.reciever)
        }

        await invitationsRepository.createQueryBuilder()
        .delete()
        .where('invitation.recieverId = :recieverId',{recieverId:invitation.reciever.id})
        .execute()
    })

     
        if(newTeamCreated){

            outputMessage += `\n team: ${invitation.sender.team.nickName} was created.`
            await this._sendTeamNotfication(invitation.sender.team.id,`you are now in the new team: ${invitation.sender.team.nickName} .`)
            
        }else{
            outputMessage += `\n ${invitation.reciever.firstName +' '+invitation.reciever.lastName} joined the ${invitation.reciever.team.nickName}.`
            await this._sendTeamNotfication(invitation.sender.team.id,`${invitation.reciever.firstName} ${invitation.reciever.lastName} joined your team`,invitation.reciever.id,`you joined the team: ${invitation.sender.team.nickName} successfully...`);
            
           
        }
       
        

        return outputMessage;
        

 
      
    }catch(err){
        Logger.error(err,'UserService/getAcceptRefuseTeamInvitation')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);
    }




    }
    // not checked or used yet
    async sendTeamJoinRequest(senderId:string,teamId:string,description:string){

        const manager = getManager();
        const teamRepository = manager.getRepository(TeamEntity);

        try{
            const team:TeamEntity = await teamRepository.findOne({id:teamId},{relations:['teamLeader']});
            //TODO : check if the team is full
            if(!team){
                Logger.error("team not found",'userService/sendTeamJoinRequest');
                throw new HttpException("team not found",HttpStatus.BAD_REQUEST);
            }
            const studentRepository = manager.getRepository(StudentEntity);
            const student = await studentRepository.findOne({id:senderId},{relations:['team']});
            if(!student){
                Logger.error("student not found",'userService/sendTeamJoinRequest');
                throw new HttpException("student not found",HttpStatus.BAD_REQUEST);
            }
            if(student.team){
                Logger.error("student already in a team",'userService/sendTeamJoinRequest');
                throw new HttpException("student already in a team",HttpStatus.BAD_REQUEST);
            }

            const invitationsRepository = manager.getRepository(InvitationEntity);
            const invitation = invitationsRepository.create({sender:student,reciever:team.teamLeader,description});
            await invitationsRepository.save(invitation);


            return `invitation sent with success from: ${student.firstName+' '+student.lastName} to team: ${team.nickName}`


        }catch(err){
            Logger.error(err,'userService/sendTeamJoinRequest');
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }

    }

    // only for tests
    async getInvitations(studentId:string){
      
        try{
           
            const manager = getManager();
           
            const studentRepository = manager.getRepository(StudentEntity);
            const invitationsRepository = manager.getRepository(InvitationEntity);
            
            const student = await studentRepository.findOne({id:studentId});
         
            if(!student){
                Logger.error("student not found",'UserService/getInvitations')
                throw new HttpException("student not found",HttpStatus.BAD_REQUEST);
            }
            const invitations:InvitationEntity[] =  await invitationsRepository.createQueryBuilder('invitation').leftJoinAndSelect('invitation.sender','sender').getMany()
            if(!invitations){
                Logger.error(`invitations related to: ${student.firstName+' '+student.lastName} not found`,'UserService/getInvitations')
                throw new HttpException(`invitations related to: ${student.firstName+' '+student.lastName} not found`,HttpStatus.BAD_REQUEST);
            }
    
            return invitations;
        }catch(err){
            Logger.error(err,'UserService/getInvitations')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);

        }


    }
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
        notifications.forEach(nf=>{
            socket.to(nf.user).emit("new_notification",nf)

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

async createTeamAnnouncement(userId:string,title:string,description:string,documents:TeamAnnoncementDocDto[]){

    try{
        const manager = getManager()
        const student = await manager.getRepository(StudentEntity)
        .createQueryBuilder('student')
        .where('student.userId = :userId',{userId})
        .innerJoinAndSelect('student.team','team')
        .innerJoinAndSelect('team.teamLeader','teamLeader')
        .getOne();

        if(!student){
            Logger.error("student not found",'UserService/createTeamAnnouncement')
            throw new HttpException("student not found",HttpStatus.BAD_REQUEST);
        }
        Logger.error(title,"*********")
        const announcementRepository = manager.getRepository(AnnouncementEntity)
        const announcement = announcementRepository.create({title,description,team:student.team})
         await announcementRepository
        .createQueryBuilder('announcement')
        .insert()
        .values(announcement)
        .execute();

        

        const announcementDocumentRepository =  manager.getRepository(AnnouncementDocumentEntity);
        const announcementDocs:TeamAnnoncementDocDto[] = [];
        documents.forEach(doc=>{
            const announcementDoc = announcementDocumentRepository.create({name:doc.name,url:doc.url,announcement});
            announcementDocs.push(announcementDoc)
        })
       
       await manager.getRepository(AnnouncementDocumentEntity).createQueryBuilder('docs')
        .insert()
        .values(announcementDocs)
        .execute();

      
       
    }catch(err){
        Logger.error(err,'UserService/createTeamAnnouncement')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);

    }

}
async getAnnouncement(userId:string){
    try{
        const manager = getManager();
        const Announcements = await manager.getRepository(AnnouncementEntity)
        .createQueryBuilder('announcement')
        .innerJoinAndSelect('announcement.team','team')
        .innerJoinAndSelect('team.students','student')
        .where('student.userId = :userId',{userId})
        .leftJoinAndSelect('announcement.documents','documents')
        .orderBy('createdAt','DESC')
        .getMany()

        
        const response = Announcements.map(({id,title,description,documents})=>{
            return {
              id,
              title,
              description,
              documents
            }
        })

        return response ;
    }catch(err){
        Logger.error(err,'UserService/getAnnouncement')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);
    }
}
async sendTeamChatMessage(studentId:string,message:string){


    try{
        const manager = getManager();
      
        const studentRepository = manager.getRepository(StudentEntity);
        const student = await studentRepository.findOne({id:studentId},{relations:['team']});
        if(!student){           
            Logger.error("student not found",'UserService/sendTeamChatMessage')
            throw new HttpException("student not found",HttpStatus.BAD_REQUEST);
        }
       
        if(!student.team){
            Logger.error("the student has no team",'UserService/sendTeamChatMessage')
            throw new HttpException("the student has no team",HttpStatus.BAD_REQUEST);
        }
        const chatRepository = manager.getRepository(TeamChatMessageEntity);
        const chat = chatRepository.create({message,team:student.team,owner:student});
        await chatRepository.save(chat);
        return `message sent with success to team: ${student.team.nickName} members`;
    }catch(err){
        Logger.error(err,'UserService/sendTeamChatMessage')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);

    }

}
/*
            survey section
*/
async createSurvey(userId:string ,survey:SurveyDto){
    const {title,description,options} = survey;
    let {period} = survey;
    if(Number.isNaN(period)){
        Logger.error("period is not a number",'UserService/createSurvey')
        throw new HttpException("period is not a number",HttpStatus.BAD_REQUEST);
    }
    

    if(period<1 && period >7){
        Logger.error("period must be between 1 and 7",'UserService/createSurvey');
        throw new HttpException("period must be between 1 and 7",HttpStatus.BAD_REQUEST);
    }
    period = period*24*60*60*1000;
    

    try{
        const manager = getManager();
        const studentRepository = manager.getRepository(StudentEntity);
        const student = await studentRepository.
        createQueryBuilder('student')
        .where('student.userId = :userId',{userId})
        .innerJoinAndSelect('student.team','team')
        .innerJoinAndSelect('team.teamLeader','teamLeader')
        .getOne()
        
      
        if(!student){       
            Logger.error("student | team   not found | student is not the teamLeader",'UserService/createSurvey')
            throw new HttpException("student not found",HttpStatus.BAD_REQUEST);
        }
   
      
        const surveyRepository = manager.getRepository(SurveyEntity);
        const surveyOptionRepository = manager.getRepository(SurveyOptionEntity);
        const survey = surveyRepository.create({title,description,period,team:student.team,close:false});
        const surveyOptions:SurveyOptionEntity[] = [];
        
        await surveyRepository.save(survey);
            for(let key in options){
                const {description} = options[key];
                const surveyOption = surveyOptionRepository.create({description,survey});
                surveyOptions.push(surveyOption);
            }
            await surveyOptionRepository.save(surveyOptions);
            const surveyData = await surveyRepository.findOne({id:survey.id});

        this._sendTeamNotfication(student.team.id,`a new survey has been created a survey with title: ${title}`);
        //running the crun job
      
        const job = new CronJob(new Date( new Date(surveyData.createdAt).getTime()+period),()=>{
            Logger.warn("survey period has ended",'UserService/createSurvey');
            surveyRepository.update({id:surveyData.id},{close:true});
            this._sendTeamNotfication(student.team.id,`the survey with title: ${title}  ended`);
        })
        this.schedulerRegistry.addCronJob(`cron_Job_surveyEnd_${surveyData.id}`,job);
        job.start();
        return `survey sent with success to team: ${student.team.nickName} members`;
    }catch(err){
        Logger.error(err,'UserService/createSurvey')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);

    } 
}

async submitSurveyAnswer(userId:string,surveyId:string,optionId:string,argument:string){
    try{
        const manager = getManager();
        const studentRepository = manager.getRepository(StudentEntity);
        const student = await studentRepository.createQueryBuilder('student')
        .innerJoinAndSelect('student.team','team')
        .innerJoinAndSelect('team.surveys','surveys')
        .where('surveys.id = :surveyId',{surveyId})
        .innerJoinAndSelect('surveys.options','options')
        .andWhere('student.userId = :userId',{userId})
        .andWhere('options.id = :optionId',{optionId})
        .getOne();
     
       
        if(!student){   
            Logger.error("survey or student or option not found",'UserService/submitSurveyAnswer')  
            throw new HttpException("survey or student or option not found",HttpStatus.BAD_REQUEST);
        }
        
        const surveyParticipantRepository = manager.getRepository(SurveyParticipantEntity);
        
        const existingSurveyParticipant = await surveyParticipantRepository.createQueryBuilder('surveyParticipant')
        .innerJoin('surveyParticipant.survey','survey')
        .innerJoin('surveyParticipant.student','student')
        .innerJoinAndSelect('surveyParticipant.answer','answer')
        .andWhere('student.userId = :userId',{userId})
        .andWhere('survey.id = :surveyId',{surveyId})
        .getOne();

     
       
        const surveyParticipant = surveyParticipantRepository.create({survey:student.team.surveys[0],student:student,answer:student.team.surveys[0].options[0],argument});

      
      
        if(!existingSurveyParticipant){
            await surveyParticipantRepository.save(surveyParticipant);
            return "survey answered succesfully"
        }
    
       if(surveyParticipant.answer.id === existingSurveyParticipant.answer.id && surveyParticipant.argument === argument){
        Logger.error("you've already answered to the survey using that option or by providing the same argument",'UserService/submitSurvey')
        throw new HttpException("you've already answered to the survey using that option",HttpStatus.BAD_REQUEST);
       }
   
       await surveyParticipantRepository.update({id:existingSurveyParticipant.id},surveyParticipant);
        
      return "answer updated succesfully"
   
        
     
    }catch(err){
        Logger.error(err,'UserService/submitSurvey')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);

    }
       
}

async getSurveys(userId:string){
    try{
        const manager =     getManager();
        const surveyRepo =   manager.getRepository(SurveyEntity);
        const surveys = await surveyRepo.createQueryBuilder('survey')
        .leftJoin('survey.team','team')
        .leftJoin('team.students','student')
        .where('student.userId = :userId',{userId})
        .leftJoinAndSelect('survey.participants','participants')
        // .leftJoinAndSelect("participants.student",'studentP')
        // .andWhere('participant.userId = :userId',{userId})
        .orderBy('survey.createdAt','DESC')
        .getMany()
    
      
        return surveys;
    }catch(err){
        Logger.error(err,'UserService/getSurveys')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);

    }
}
async getSurvey(userId:string,surveyId:string){
    try{
        const manager =     getManager();
        const surveyRepo =   manager.getRepository(SurveyEntity);
        const survey = await surveyRepo.createQueryBuilder('survey')
        .where('survey.id = :surveyId',{surveyId})
        .leftJoin('survey.team','team')
        .leftJoin('team.students','student')
        .andWhere('student.userId = :userId',{userId})
        .leftJoinAndSelect('survey.participants','participant','participant.student.id = student.id')
        .leftJoinAndSelect('participant.answer','answer')
        .leftJoinAndSelect('survey.options','options')
        .loadRelationCountAndMap('options.answersCount','options.participations')
        .leftJoinAndSelect("participant.student",'participantStudent','participantStudent.id = student.id')

        .getOne()
      
      
        const response = {...survey};
        const participants = response.participants;
        delete response.participants;
        response['argument'] = participants?.length>=1 ?participants[0].argument:null;
        response['answer'] = participants?.length>=1 ?participants[0].answer:'';
        return response;
    }catch(err){
        Logger.error(err,'UserService/getSurvey')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);

    }
}

async getSurveyParticipantsArguments(userId:string,surveyId:string,optionId:string){
    try{
        const manager = getManager();


        return await manager.getRepository(SurveyParticipantEntity)
        .createQueryBuilder('participant')
        .where(qb=>{
            const subQuery = qb.subQuery()
            .select('survey.id')
            .from(StudentEntity,'student')
            .where('student.userId = :userId',{userId})
            .leftJoin('student.team','team')
            .leftJoin('team.surveys','survey')
            .andWhere('survey.id = :surveyId',{surveyId})
           .getQuery()
           return 'participant.surveyId IN '+subQuery;
        })
        .andWhere('participant.answerId = :optionId',{optionId})
        .leftJoinAndSelect('participant.student','student')
        .getMany()

        

    }catch(err){
        Logger.error(err,'UserService/getSurveyParticipantsArguments')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);

    }
}
//meet
async createNormalTeamMeet(studentId:string,meet:NormalTeamMeetDto){
    try{
        const {title,description,weekDay,hour,minute,second} = meet;
        if(Number.isNaN( Number(weekDay)) || Number.isNaN(Number(hour)) || Number.isNaN(Number(minute)) || Number.isNaN(Number(second))){
            Logger.error("invalid time",'UserService/createMeet')
            throw new HttpException("invalid time",HttpStatus.BAD_REQUEST);
        }
        if(weekDay < 0 || weekDay > 6){
            Logger.error("invalid weekDay",'UserService/createMeet')
            throw new HttpException("invalid weekDay",HttpStatus.BAD_REQUEST);
        }
        if(hour < 0 || hour > 23){
            Logger.error("invalid hour",'UserService/createMeet')
            throw new HttpException("invalid hour",HttpStatus.BAD_REQUEST);
        }
        if(minute < 0 || minute > 59){
            Logger.error("invalid minute",'UserService/createMeet')
            throw new HttpException("invalid minute",HttpStatus.BAD_REQUEST);
        }
        if(second < 0 || second > 59){
            Logger.error("invalid second",'UserService/createMeet')
            throw new HttpException("invalid second",HttpStatus.BAD_REQUEST);
        }
        const manager = getManager();
        const studentRepository = manager.getRepository(StudentEntity);
       
        const student = await studentRepository.createQueryBuilder('student')
        .innerJoinAndSelect('student.team','team')
        .innerJoin('team.teamLeader','teamLeader')
        .where('student.id = :studentId',{studentId})
        .getOne();
        if(!student){       
            Logger.error("not found",'UserService/createMeet')
            throw new HttpException("student not found",HttpStatus.BAD_REQUEST);
        }
      
    

    
            const meetRepository = manager.getRepository(MeetEntity);
            const meetEntity = meetRepository.create({title,description,weekDay,hour,minute,second,team:student.team,type:MeetType.NORMAL});
            await meetRepository.save(meetEntity);

            this._sendTeamNotfication(student.team.id,`new normal meet: '${title}' every week on ${weekDay} at ${hour}:${minute}:${second}`);
            const cronExpression =   `${second} ${minute} ${hour-1} * * ${weekDay}`;
            const job = new CronJob(cronExpression,async()=>{
               
                this._sendTeamNotfication(student.team.id,`the normal meet with title: '${title}' will be starting after a hour`);

            })
            this.schedulerRegistry.addCronJob(`cron_Job_normal_meet_${meetEntity.id}`,job);
            job.start();

       
      
           
        return `meet sent with success to team: ${student.team.nickName} members`;
    }catch(err){
        Logger.error(err,'UserService/createMeet')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);

    } 
}


async createUrgentTeamMeet(studentId:string,meet:UrgentTeamMeetDto){
    try{
        const manager = getManager();
        const studentRepository = manager.getRepository(StudentEntity);
       
        const student = await studentRepository.createQueryBuilder('student')
        .innerJoinAndSelect('student.team','team')
        .innerJoin('team.teamLeader','teamLeader')
        .where('student.id = :studentId',{studentId})
        .getOne();
        if(!student){       
            Logger.error("not found",'UserService/createMeet')
            throw new HttpException("student not found",HttpStatus.BAD_REQUEST);
        }
        const {title,description,date} = meet;
        const meetRepository = manager.getRepository(MeetEntity);
        const meetEntity = meetRepository.create({title,description,date,team:student.team,type:MeetType.URGENTE});
        await meetRepository.save(meetEntity);

        this._sendTeamNotfication(student.team.id,`new urgent meet: '${title}' at ${date}`);
        const job = new CronJob(new Date(meetEntity.date.getTime()-1*60*60*1000),async()=>{
           
        
            this._sendTeamNotfication(student.team.id,`the urgent meet with title: '${title}' will be starting at : ${date}`);

        })
        this.schedulerRegistry.addCronJob(`cron_Job_urgent_meet_${meetEntity.id}`,job);
        job.start();
    
        return "urgent meet created";

    }catch(err){
        Logger.error(err,'UserService/createMeet')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);
    }
}


async getStudentsWithoutTeam(userId:string){
    const manager = getManager();
    try{
        
        const studentRepository = manager.getRepository(StudentEntity);
      
      
      return await  studentRepository.createQueryBuilder('student')
        .where(qb=>{
                const subQuery = qb.subQuery()
                .select('student.promotionId')
                .from(StudentEntity,'student')
                .where('student.userId = :userId',{userId})
                .getQuery();

                return 'student.promotionId  IN '+subQuery;

        })
        .andWhere('student.userId <> :userId',{userId})
        .andWhere('student.teamId IS NULL')
        .getMany()
        
       
    }catch(err){
        Logger.error(err,'UserService/getStudentsWithoutTeam')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);
    }
}

async getInvitationList(userId:string){
    const manager = getManager();
    const invitationsRepository = manager.getRepository(InvitationEntity);
    try{
        const invitations = await invitationsRepository
        .createQueryBuilder('invitation')
        .leftJoinAndSelect('invitation.reciever','reciever')
        .where('reciever.userId = :userId',{userId})
        .leftJoinAndSelect('invitation.sender','sender')
        .leftJoinAndSelect('sender.team','team')
        .getMany()

      
    
        const reponses = invitations.map(inv=>{
            const {id,description,sender} = inv;
            if(sender.team){
                return {
                    id,
                    description,
                    senderTeam:{
                        id:sender.team.id,
                        nickname:sender.team.nickName,
                        teamLeader:{
                            id:sender.id,
                            firstname:sender.firstName,
                            lastName:sender.lastName
                        }
                    }
                }

            }else{
                return {
                    id,
                    description,
                    student:{
                        id:sender.id,
                        firstname:sender.firstName,
                        lastName:sender.lastName
                    }
                }
            }
           
        })
        
        return reponses;
    }catch(err){
        Logger.error(err,'UserService/getInvitationList')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);

    }
  

}
//crud operations document----------------------------------------
async addTeamDocument(userId:string,name:string,url:string,description:string){
    try{
        const manager = getManager();
        const team = await manager.getRepository(TeamEntity)
        .createQueryBuilder('team')
        .leftJoinAndSelect('team.students','student')
        .where('student.userId = :userId',{userId})
        .getOne();
        if(!team){
            Logger.error("user not found",'UserService/addTeamDocument')
              throw new HttpException("user not found",HttpStatus.BAD_REQUEST);
        }

        const teamDocumentRepository = manager.getRepository(TeamDocumentEntity);
        const teamDocument = teamDocumentRepository.create({name,url,team,description,owner:team.students[0]})

         manager.getRepository(TeamDocumentEntity)
        .createQueryBuilder('teamDoc')
        .insert()
        .values(teamDocument)
        .execute()

      


    }catch(err){
        Logger.error(err,'UserService/addTeamDocument')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);
    }
}
async getTeamDocuments(userId:string){
    try{
        const manager = getManager();
        const team = await manager.getRepository(TeamEntity)
        .createQueryBuilder('team')
        .leftJoinAndSelect('team.students','student')
        .where('student.userId = :userId',{userId})
        .leftJoinAndSelect('team.documents','document')
        .leftJoinAndSelect('document.owner','owner')
        .getOne();

        if(!team){
            Logger.error("team not found",'UserService/getTeamDocuments')
              throw new HttpException("user not found",HttpStatus.BAD_REQUEST);
        }

        return team.documents;
        

    }catch(err){
        Logger.error(err,'UserService/getTeamDocuments')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);
    }
}
async deleteTeamDocs(userId:string,docsIds:string[]){
    try{
        const manager = getManager();
        const team = await manager.getRepository(TeamEntity)
        .createQueryBuilder('team')
        .leftJoinAndSelect('team.students','student')
        .where('student.userId = :userId',{userId})
        .leftJoinAndSelect('team.documents','document')
        .leftJoinAndSelect('document.owner','owner')
        .getOne();
        if(!team){
            Logger.error("team not found",'UserService/deleteTeamDocs')
              throw new HttpException("user not found",HttpStatus.BAD_REQUEST);
        }
        const documents = team.documents.filter(doc=>docsIds.some(id=>id === doc.id))
        if(documents.length != docsIds.length){
            Logger.error("wrong docs ids",'UserService/deleteTeamDocs')
            throw new HttpException("wrong docs ids",HttpStatus.BAD_REQUEST);
        }
        
        documents.forEach( doc=>{

           
              fs.unlink(path.resolve(doc.url),(err)=>{
                  if(err){

                      Logger.error(`failed to delete the document with id: ${doc.id} and url: ${doc.url}`,'UserService/deleteTeamDocs ',err)
                   
                      
                }
                      
            })





        })
        await manager.getRepository(TeamDocumentEntity)
        .createQueryBuilder('documents')
        .delete()
        .where('team_document.id IN (:...docsIds)',{docsIds})
        .execute()
        

    }catch(err){
        Logger.error(err,'UserService/deleteTeamDocs')
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
//crud operations theme suggestions
async createThemeSuggestion(userId:string,title:string,description:string,documents:ThemeDocDto[],promotionId:string){

    try{
        const manager = getManager()
        const user = await manager.getRepository(UserEntity)
        .createQueryBuilder('user')
        .where('user.id = :userId',{userId})
        .getOne();

      
        
        if(!user){
            Logger.error("user not found",'UserService/createThemeSuggestion')
            throw new HttpException("user not found",HttpStatus.BAD_REQUEST);
        }

        const {userType} = user;
        if(userType !== UserType.TEACHER && userType !== UserType.ENTERPRISE ){
            Logger.error("you need to be either a teacher or an entreprise to submit a theme suggestion ",'UserService/createThemeSuggestion')
            throw new HttpException("you need to be either a teacher or an entreprise to submit a theme suggestion  ",HttpStatus.BAD_REQUEST);
        }
        const promotion = await manager.getRepository(PromotionEntity)
        .createQueryBuilder('promotion')
        .where('promotion.id = :promotionId',{promotionId})
        .getOne()

        if(!promotion){
            Logger.error("promotion not found",'UserService/createThemeSuggestion')
            throw new HttpException("promotion not found",HttpStatus.BAD_REQUEST);
        }
        let themeSuggestion;
        const themeRepository = manager.getRepository(ThemeEntity)
        if(userType === UserType.TEACHER){
            const teacher = await manager.getRepository(TeacherEntity)
            .createQueryBuilder('teacher')
            .where('teacher.userId = :userId',{userId})
            .getOne();
            themeSuggestion = themeRepository.create({title,description,suggestedByTeacher:teacher,promotion})

        }else if(userType === UserType.ENTERPRISE){
            const entreprise = await manager.getRepository(EntrepriseEntity)
            .createQueryBuilder('entrprise')
            .where('entrprise.userId = :userId',{userId})
            .getOne();
            themeSuggestion = themeRepository.create({title,description,suggestedByEntreprise:entreprise,promotion})


        }
        
     
        
        
        
      
         await themeRepository
        .createQueryBuilder()
        .insert()
        .values(themeSuggestion)
        .execute();

        

        const themeDocumentRepository =  manager.getRepository(ThemeDocumentEntity);
        const themeSuggestionsDocs:ThemeDocumentEntity[] = [];
        documents.forEach(doc=>{
            const themeSugDoc = themeDocumentRepository.create({name:doc.name,url:doc.url,theme:themeSuggestion});
            themeSuggestionsDocs.push(themeSugDoc)
        })
       
       await themeDocumentRepository.createQueryBuilder()
        .insert()
        .values(themeSuggestionsDocs)
        .execute();

      
       
    }catch(err){
        Logger.error(err,'UserService/createThemeSuggestion')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);

    }

}
async getThemeSuggestions(promotionId:string){
    try{
        const manager = getManager();
        const themeSuggestions:ThemeEntity[] = await manager.getRepository(ThemeEntity)
        .createQueryBuilder('theme')
        .where('theme.promotionId = :promotionId',{promotionId})
        .leftJoinAndSelect('theme.suggestedByTeacher','suggestedByTeacher','theme.suggestedByTeacher IS NOT NULL')
        .leftJoinAndSelect('theme.suggestedByEntreprise','suggestedByEntreprise','theme.suggestedByEntreprise IS NOT NULL')
        .getMany()
       

       return themeSuggestions
        

       

       
    }catch(err){
        Logger.error(err,'UserService/getThemeSuggestions')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);
    }
}
async getAllThemeSuggestions(){
    try{
        const manager = getManager();
        const themeSuggestions:ThemeEntity[] = await manager.getRepository(ThemeEntity)
        .createQueryBuilder('theme')
        .leftJoinAndSelect('theme.suggestedByTeacher','suggestedByTeacher','theme.suggestedByTeacher IS NOT NULL')
        .leftJoinAndSelect('theme.suggestedByEntreprise','suggestedByEntreprise','theme.suggestedByEntreprise IS NOT NULL')
        .leftJoinAndSelect('theme.promotion','promotion')
        .getMany()

        return themeSuggestions;

     
       
    }catch(err){
        Logger.error(err,'UserService/getAllThemeSuggestions')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);
    }
}
async getThemeSuggestion(themeId:string){
    try{

        const manager = getManager();
        const themeSuggestion = await manager.getRepository(ThemeEntity)
        .createQueryBuilder('theme')
        .where("theme.id = :themeId",{themeId})
        .leftJoinAndSelect('theme.suggestedByTeacher','suggestedByTeacher')
        .leftJoinAndSelect('theme.suggestedByEntreprise','suggestedByEntreprise')
        .leftJoinAndSelect('theme.documents','documents')
        .leftJoinAndSelect('theme.promotion','promotion')
        .getOne()

       
        return themeSuggestion ;
    }catch(err){
        Logger.error(err,'UserService/getThemeSuggestion')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);
    }
}
async validateThemeSuggestion(userId:string,themeId:string){
    try{
        const manager = getManager();

        const user = await manager.getRepository(UserEntity)
        .createQueryBuilder('user')
        .where('user.userType = :userType',{userType:UserType.ADMIN})
        .andWhere('user.id = :userId',{userId})
        .getOne()
        if(!user){
            Logger.error("permession denied",'UserService/validateThemeSuggestion')
            throw new HttpException("permession denied",HttpStatus.BAD_REQUEST);
        }

        await manager.getRepository(ThemeEntity)
        .createQueryBuilder('theme')
        .update()
        .set({validated:true})
        .where('theme.id = :themeId',{themeId})
        .execute();

    }catch(err){
        Logger.error(err,'UserService/validateThemeSuggestion')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);
        
    }
}

//themes
async getAllThemes(){
    try{
        const manager = getManager();
        const themeSuggestions:ThemeEntity[] = await manager.getRepository(ThemeEntity)
        .createQueryBuilder('theme')
        .where('theme.validated = true')
        .leftJoinAndSelect('theme.suggestedByTeacher','suggestedByTeacher','theme.suggestedByTeacher IS NOT NULL')
        .leftJoinAndSelect('theme.suggestedByEntreprise','suggestedByEntreprise','theme.suggestedByEntreprise IS NOT NULL')
        .leftJoinAndSelect('theme.promotion','promotion')
        .getMany()

        return themeSuggestions;

     
       
    }catch(err){
        Logger.error(err,'UserService/getAllThemeSuggestions')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);
    }
}

async getThemes(promotionId:string){
    try{
        const manager = getManager();
        const themeSuggestions:ThemeEntity[] = await manager.getRepository(ThemeEntity)
        .createQueryBuilder('theme')
        .where('theme.validated = true')
        .andWhere('theme.promotionId = :promotionId',{promotionId})
        .leftJoinAndSelect('theme.suggestedByTeacher','suggestedByTeacher','theme.suggestedByTeacher IS NOT NULL')
        .leftJoinAndSelect('theme.suggestedByEntreprise','suggestedByEntreprise','theme.suggestedByEntreprise IS NOT NULL')
        .getMany()
       

       return themeSuggestions
        

       

       
    }catch(err){
        Logger.error(err,'UserService/getThemes')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);
    }
}
async getTheme(themeId:string){
    try{

        const manager = getManager();
        const theme = await manager.getRepository(ThemeEntity)
        .createQueryBuilder('theme')
        .where("theme.id = :themeId",{themeId})
        .leftJoinAndSelect('theme.suggestedByTeacher','suggestedByTeacher')
        .leftJoinAndSelect('theme.suggestedByEntreprise','suggestedByEntreprise')
        .leftJoinAndSelect('theme.documents','documents')
        .leftJoinAndSelect('theme.promotion','promotion')
        .leftJoinAndSelect('theme.teams','teams')
        .leftJoinAndSelect('theme.encadrement','encadrement')
        .leftJoinAndSelect('encadrement.teacher','teacher')
        .getOne()

       
        return theme ;
    }catch(err){
        Logger.error(err,'UserService/getTheme')
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

async encadrerTheme(userId:string,themeId:string,teacherId:string){
        try{
            const manager = getManager();
            const user = manager.getRepository(UserEntity)
            .createQueryBuilder('user')
            .where("user.id = :userId",{userId})
            .andWhere("user.userType = :userType",{userType:UserType.ADMIN})
            .getOne();
            if(!user){
                Logger.log("permission denied","UserService/encadrerTheme")
                throw new HttpException("permission denied",HttpStatus.BAD_REQUEST)
            } 

            const theme = await manager.getRepository(ThemeEntity)
            .createQueryBuilder('theme')
            .where('theme.id = :themeId',{themeId})
            .andWhere('theme.validated = true')
            .getOne();

            if(!theme){
                Logger.log("theme not found","UserService/encadrerTheme")
                throw new HttpException("theme not found",HttpStatus.BAD_REQUEST)

            }

            const teacher = await manager.getRepository(TeacherEntity)
            .createQueryBuilder('teacher')
            .where('teacher.id = :teacherId',{teacherId})
            .getOne();

            if(!teacher){
                Logger.log("teacher not found","UserService/encadrerTheme")
                throw new HttpException("teacher not found",HttpStatus.BAD_REQUEST)

            }
            const encadrement =   await manager.getRepository(EncadrementEntity)
            .createQueryBuilder('encadrement')
            .where('encadrement.teacherId = :teacherId and encadrement.themeId = :themeId',{teacherId,themeId})
            .getOne()
            if(encadrement){
                Logger.log("l'ensiegnant est deja un encadreur de ce theme","UserService/encadrerTheme")
                throw new HttpException("l'ensiegnant est deja un encadreur de ce theme",HttpStatus.BAD_REQUEST)
            }
            
            await manager.getRepository(EncadrementEntity)
            .createQueryBuilder('')
            .insert()
            .values({theme,teacher})
            .execute()
            

        }catch(err){
            
            Logger.log(err,"UserService/encadrerTheme")
            throw new HttpException(err,HttpStatus.BAD_REQUEST)
        }
}


async assignTeamToTeacher(userId:string,teamId:string,teacherId:string){
    try{
        const manager = getManager();
        const user = manager.getRepository(UserEntity)
        .createQueryBuilder('user')
        .where("user.id = :userId",{userId})
        .andWhere("user.userType = :userType",{userType:UserType.ADMIN})
        .getOne();
        if(!user){
            Logger.log("permission denied","UserService/assignTeamToTeacher")
            throw new HttpException("permission denied",HttpStatus.BAD_REQUEST)
        } 

        const encadrement = await manager.getRepository(EncadrementEntity)
        .createQueryBuilder('encadrement')
        .where('encadrement.teacherId = :teacherId',{teacherId})
        .innerJoinAndSelect('encadrement.theme','theme')
        .innerJoinAndSelect('theme.teams','team')
        .andWhere('team.id = :teamId',{teamId})
        .getOne();

        if(!encadrement){
            Logger.log("l'ensiegnant doit encadrer le theme affecter a l'equipe","UserService/assignTeamToTeacher")
            throw new HttpException("l'ensiegnant doit encadrer le theme affecter a l'equipe",HttpStatus.BAD_REQUEST)
        }

        await manager.getRepository(ResponsibleEntity)
        .save({teacher:encadrement.teacher,team:encadrement.theme.teams[0]})
        
      


    }catch(err){
         
        Logger.log(err,"UserService/assignTeamToTeacher")
        throw new HttpException(err,HttpStatus.BAD_REQUEST)

    }
}
// completer les equipes
async completeTeams(userId:string,promotionId:string){
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
        .leftJoinAndSelect('team.students','students')
        .leftJoinAndSelect('team.teamLeader','teamLeader')
        .getOne();

        if(!user){
            Logger.log("permission denied","UserService/submitWishList")
            throw new HttpException("permission denied",HttpStatus.BAD_REQUEST)
        } 
        if(!promotion){
            Logger.log("promotion not found","UserService/submitWishList")
            throw new HttpException("promotion not found",HttpStatus.BAD_REQUEST)
        }  
        let teamsExtraMembers:TeamEntity[] = [];
        let teamsNeedMembers:TeamEntity[]  = [];
        
        const studentsAddToTeamLater:{team:TeamEntity,student:StudentEntity}[] = []
        const studentsModifiedTeams = []

        let studentsToBeInsertedInNewTeam:StudentEntity[] = [];
     


        promotion.teams.forEach(team=>{
            if(team.students.length >= promotion.minMembersInTeam ){
                teamsExtraMembers.push(team)
            }else if(team.students.length < promotion.minMembersInTeam) {
                teamsNeedMembers.push(team)
            }
        })
       

        const students = await manager.getRepository(StudentEntity)
        .createQueryBuilder('student')
        .where('student.promotionId = :promotionId',{promotionId})
        .andWhere('student.teamId IS NULL')
        
        .getMany();

    
    
        //inserting students into the teams starting from  those who  have less students first
         //@ts-ignore
         teamsNeedMembers = teamsNeedMembers.sort((a,b)=>a.membersCount-b.membersCount)
         let i =0;
         let j = 0;

                while(i<teamsNeedMembers.length && j<students.length){
                    const teamNeedMembers = teamsNeedMembers[i];
                    let toBeCompleted:number =  promotion.minMembersInTeam -teamNeedMembers.students.length;
                   
                    while( toBeCompleted  > 0 && j<students.length){
                        teamNeedMembers.students.push(students[j])
                        studentsAddToTeamLater.push({student:students[j],team:teamNeedMembers})
                        toBeCompleted =  promotion.minMembersInTeam -teamNeedMembers.students.length;
                        if(toBeCompleted ===0){
                            teamsNeedMembers = teamsNeedMembers.filter(el=>el.id === teamNeedMembers.id)
                        }

                        j++;
                    }
                  i++;
                }
        
        let studentsNotYetInserted = students.slice(j,students.length)
        if(teamsNeedMembers.length === 0){ 
           
                 /*
                   inserting the student into  a not completed team or create a new team for them
                 */

                let i = 0;
                let j = 0;
                while(i<promotion.teams.length && j<studentsNotYetInserted.length){
                        const tm = promotion.teams[i];
                        const  nb:number = studentsAddToTeamLater.filter(({team}) =>team.id === tm.id).length
                        let numberOfStudents = tm.students.length + nb;
                        let toBeFull = promotion.maxMembersInTeam - numberOfStudents;
                    while(toBeFull>0 && j<studentsNotYetInserted.length){
                        studentsAddToTeamLater.push({student:studentsNotYetInserted[j],team:tm})
                        toBeFull--;
                        j++;
                    }
                    

                    i++;
                }

                studentsNotYetInserted = studentsNotYetInserted.slice(j,studentsNotYetInserted.length)

                if(studentsNotYetInserted.length >0){
                    studentsToBeInsertedInNewTeam = [...studentsNotYetInserted];
                }
                
                
                

          
           
          
        }else{
          
            //lopping through the teamsExtraMembers array and modifying the team of an extra member into the 
            // team that needs it
            let i = 0;
            while(i<teamsExtraMembers.length && teamsNeedMembers.length >0){
                const extra:number = teamsExtraMembers[i].students.length - promotion.minMembersInTeam;
                if(extra !==0){
                  
              
                const teamExtraMembers = teamsExtraMembers[i];
                const extraStudent = teamExtraMembers.students.find(st=>teamExtraMembers.teamLeader.id !==st.id)          
                teamExtraMembers.students = teamExtraMembers.students.filter(st=>st.id !==extraStudent.id)
                studentsModifiedTeams.push({student:extraStudent,from:teamExtraMembers,to:teamsNeedMembers[teamsNeedMembers.length -1]})
                teamsNeedMembers.pop()
              }

                i++;

            }
        }

            
            
      
       
       
        return {
            studentsAddToTeamLater,
            studentsModifiedTeams,
            studentsToBeInsertedInNewTeam
        }

    }catch(err){
        Logger.log(err,"UserService/completeTeams")
        throw new HttpException(err,HttpStatus.BAD_REQUEST)
        
    }
}

async asignThemesToTeams(userId:string,promotionId:string,method:string){
        try{
            const manager = getManager();
            const user = manager.getRepository(UserEntity)
            .createQueryBuilder('user')
            .where("user.id = :userId",{userId})
            .andWhere("user.userType = :userType",{userType:UserType.ADMIN})
            .getOne();

            if(!user){
                Logger.log("permission denied","UserService/asignThemeToTeams")
                throw new HttpException("permission denied",HttpStatus.BAD_REQUEST)
            } 
          


            const Themes = await manager.getRepository(ThemeEntity)
            .createQueryBuilder('theme')
            .leftJoinAndSelect('theme.promotion','promotion')
            .where('promotion.id = :promotionId',{promotionId})
            .andWhere('theme.validated = true')
            .leftJoinAndSelect('theme.wishes','wish')
            .leftJoinAndSelect('wish.team','team')
            .orderBy('wish.order','ASC')
            .leftJoinAndSelect('team.students','student')
            .getMany();

              //
              
              const teams = await manager.getRepository(TeamEntity)
              .createQueryBuilder('team')
              .where(qb=>`team.id not in ${qb.subQuery()
              .select('wish.teamId').from(WishEntity,'wish').getQuery()}`)
             .getMany()
            if(teams.length >0){
                const newWishes = []
                let newThemes =JSON.parse(JSON.stringify(Themes));
                newThemes = newThemes.map(nth=>{
                  const newNth = {...nth}
                  delete newNth.promotion;
                  delete newNth.wishes;
                  delete newNth.team;
                  return newNth;
                })
             teams.forEach(team=>{
                newThemes.forEach((th,index)=>{
                  
                   
                     newWishes.push({
                         team,
                         order:index,
                         theme:th
                     })
                 })
             })

                await manager.getRepository(WishEntity)
                .save(newWishes)

            }
               
  
              //

          

            const af_team_to_th = {};
            const ignoreTeam = new Set()
            Themes.forEach(theme=>{
                af_team_to_th[theme.id] = []
               
                const {maxTeamForTheme} =theme.promotion;
              

                let wishes = theme.wishes;
              
                if(method === 'moy'){
                    wishes = theme.wishes.sort((a,b)=>{
                        const getMoyTeam = team =>{
                            let sum = 0;
                            team.students.forEach(st=>{
                                sum += st.moy;
                            })
                            return sum /team.students.length;
                        }
    
                        return (a.order === b.order)? getMoyTeam(a.team) - getMoyTeam(b.team):0;
                    })

                }else if(method === 'random'){
                    wishes = theme.wishes.sort((a,b)=>{
                      
    
                        return (a.order === b.order)? 0.5 - Math.random():0;
                    })
                }else if(method === 'time'){
                    wishes = theme.wishes.sort((a,b)=>{
                      
    
                        return (a.order === b.order)? (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()):0;
                    })
                }
              
                for(let k in wishes){
                    const wish =  wishes[k];
                    const {team,order} = wish;
                    if(ignoreTeam.has(team.id)){
                        continue;
                    }
                  
                    if(af_team_to_th[theme.id].length <maxTeamForTheme){
                        console.log("____________________")
                        console.log("maxTeamForTheme:",maxTeamForTheme)
                        console.log("af_team_to_th[theme.id].length:",af_team_to_th[theme.id].length)
                        af_team_to_th[theme.id].push(team)
                       ignoreTeam.add(team.id)
                    }
                    
                }
              
              

            })

            return Object.keys(af_team_to_th).map(el=>{
                const teams = af_team_to_th[el].map(team=>{
                    const newTeam = {...team}
                    delete newTeam.students 
                    return newTeam
                })
                const {title,id} = Themes.find(th=>th.id === el);
                return {
                    theme:{
                        id,
                        title
                    },
                    teams
                }
            });



        }catch(err){
        Logger.log(err,"UserService/asignThemeToTeams")
        throw new HttpException(err,HttpStatus.BAD_REQUEST)
        
    }

}
async applyThemesToTeamsAssignements(userId:string,data:ThemeToTeamDTO):Promise<any>{
    try{
        
        const manager = getManager();
        const user = manager.getRepository(UserEntity)
        .createQueryBuilder('user')
        .where("user.id = :userId",{userId})
        .andWhere("user.userType = :userType",{userType:UserType.ADMIN})
        .getOne();

        if(!user){
            Logger.log("permission denied","UserService/applyThemesToTeamsAssignements")
            throw new HttpException("permission denied",HttpStatus.BAD_REQUEST)
        } 
      


        //
        let fetchTeamIds:string[] = []
        let themeIds:string[] = []
        console.log(data,'77777777')
        for(let k in  data.themeToTeam){
            const el = data.themeToTeam[k]
            const {idTheme,teamIds} = el;
            console.log(el,'55555555555')
            themeIds.push(idTheme)
            fetchTeamIds = [...fetchTeamIds,...teamIds];
        }
       

      

        const themes = await manager.getRepository(ThemeEntity)
        .createQueryBuilder('theme')
        .where('theme.id IN (:...themeIds)',{themeIds})
        .getMany();
        const teams = await manager.getRepository(TeamEntity)
        .createQueryBuilder('team')
        .where('team.id IN (:...fetchTeamIds)',{fetchTeamIds})
        .getMany();
     
        if(themes.length !=themeIds.length){
            Logger.error("error in theme ids",'UserService/applyThemesToTeamsAssignements')
            throw new HttpException("error in theme ids",HttpStatus.BAD_REQUEST);
        }   
        if(teams.length !== fetchTeamIds.length){
            Logger.error("error in team ids",'UserService/applyThemesToTeamsAssignements')
            throw new HttpException("error in team ids",HttpStatus.BAD_REQUEST);
        }

        await getConnection().transaction(async manager =>{
            data.themeToTeam.forEach(async ({idTheme,teamIds})=>{
                const theme = themes.find(el=>el.id === idTheme)
                
                teamIds.forEach(async teamId=>{
                    
                    await manager.getRepository(TeamEntity)
                    .createQueryBuilder('team')
                    .update()
                    .set({givenTheme:theme})
                    .where('team.id = :teamId',{teamId})
                    .execute()
                })
                
            })

        })
      



    }catch(err){
        Logger.error(err,'UserService/applyThemesToTeamsAssignements')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);
    }
}
//team crud operations
async getTeams(){
    try{
        const manager = getManager();
        const teams = await manager.getRepository(TeamEntity)
        .createQueryBuilder('team')
        .leftJoinAndSelect('team.givenTheme','givenTheme')
        .loadRelationCountAndMap('team.membersCount','team.students')
        .leftJoinAndSelect('team.promotion','promotion')
        .getMany();
        
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
        }) ;
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
            const {id,nickName,givenTheme,students,promotion,teamLeader} = team;
            return {
                id,
                pseudo:nickName,
                theme:givenTheme,
                members:students,
                promotion:promotion,
                validated: students.length >= promotion.minMembersInTeam &&  students.length <=  promotion.maxMembersInTeam,
                teamLeader
            }
     
    }catch(err){
        Logger.error(err,'UserService/getTeam')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);
    }
  
}
//messages crud operations

async getTeamMessages(userId){
    try{
        const manager = getManager();
      const teamMessages = await manager.getRepository(TeamChatMessageEntity)
      .createQueryBuilder('messages')
      .leftJoinAndSelect('messages.owner','owner')
      .innerJoin('messages.team','team')
      .innerJoin('team.students','student')
      .where('student.userId = :userId',{userId})
      .orderBy('createdAt','ASC')
      .getMany()

      return teamMessages;

      
    }catch(err){
        Logger.error(err,'UserService/getTeams')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);
    }
}


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
async createNewPromotion(name:string){
    try{
        const manager = getManager();

        await manager.getRepository(PromotionEntity)
        .createQueryBuilder()
        .insert()
        .values({name})
        .execute();

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


}

