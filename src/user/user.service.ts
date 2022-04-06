import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { NormalTeamMeetDto, SurveyDto , UrgentTeamMeetDto } from "src/core/dtos/user.dto";
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
import { getManager } from "typeorm";
import {SchedulerRegistry,CronExpression} from '@nestjs/schedule'
import { CronJob } from "cron";
import { MeetEntity, MeetType } from "src/core/entities/meet.entity";
@Injectable()
export class UserService{
    constructor(private schedulerRegistry: SchedulerRegistry){}
    
    async getUserInfo(userId:string){
        const manager = getManager();
        const userRepository = manager.getRepository(UserEntity);
        let user;
        try{
            
             user = await userRepository.findOne({id:userId});
        
        }catch(err){
            Logger.error(err,'UserService/getUserInfo')
            throw new HttpException("user not found",HttpStatus.BAD_REQUEST)
            
        }
       
        switch(user.userType){
        
            case UserType.STUDENT:

                const studentRepository = manager.getRepository(StudentEntity);
                let student;
                try{
                     student = await studentRepository.createQueryBuilder('student').where('student.userId =:id',{id:user.id}).getOne();

                }catch(err){
                    Logger.error(err,'UserService/getUserInfo')
                    throw new HttpException("user not found",HttpStatus.BAD_REQUEST)
                }
               

                return student;
            break;
            case UserType.ENTERPRISE:
                

            break;
            case UserType.ADMIN:
                

            break;
            case UserType.TEACHER:
                

            break;

        }
        
       
    }
    /*
     * team leader/student sends an invitation  to a student without a team
     * 
     */
    async sendATeamInvitation(senderId:string,recieverId:string,description:string){

        if(senderId === recieverId){
            Logger.error("you can't send a team invitation to your self !!",'UserService/sendATeamInvitation')
            throw new HttpException("you can't send a team invitation to your self !!",HttpStatus.BAD_REQUEST);
        }
        const manager = getManager();
        try{
            const sender = await manager.getRepository(StudentEntity).findOne({id:senderId},{relations:['team','sentInvitations']})
            if(!sender){
                Logger.error("sender not found",'UserService/sendATeamInvitation')
                throw new HttpException("sender not found",HttpStatus.BAD_REQUEST);
            }

            const reciever =  await manager.getRepository(StudentEntity).findOne({id:recieverId},{relations:['team','sentInvitations']});
            if(!reciever){
                Logger.error("reciever not found",'UserService/sendATeamInvitation')
                throw new HttpException("receiver not found",HttpStatus.BAD_REQUEST);
            }

            if(reciever.team ){
                Logger.error("le destinataire doit etre sans equipe.",'UserService/sendATeamInvitation')
                throw new HttpException("le destinataire doit etre sans equipe.",HttpStatus.BAD_REQUEST)
            }

            const invitationsRepository = manager.getRepository(InvitationEntity);
            const invitation:InvitationEntity = invitationsRepository.create({description,sender,reciever});
            await invitationsRepository.save(invitation);
            return JSON.stringify({sender,reciever,description}) ;
        }catch(err){
            Logger.error(err,'UserService/sendATeamInvitation')
            throw new HttpException(err,HttpStatus.BAD_REQUEST)
        }


     
      

    }
        /*
         * the receiver of the invitation
         * 
         */
    async acceptRefuseTeamInvitation(invitationId:string,receiverId:string,accepted:boolean){
     
      
     
        const manager = getManager();

        const invitationsRepository = manager.getRepository(InvitationEntity);
        let invitation:InvitationEntity;
        try{
             invitation = await invitationsRepository.findOne({id:invitationId},{
                 relations:['reciever','sender','sender.team','reciever.team']
             });
     
        if(!invitation){
            Logger.error("invitation not found",'UserService/getAcceptRefuseTeamInvitation')
            throw new HttpException("invitation not found",HttpStatus.BAD_REQUEST);
        }
        if(invitation.reciever.id!= receiverId){
            Logger.error("you are not the right reciever",'UserService/getAcceptRefuseTeamInvitation')
            throw new HttpException("invitation not found",HttpStatus.BAD_REQUEST);
        }
      
      if(!accepted){
          /*
            either a teamLeader or a student  refused the invitation
          */
          await invitationsRepository.delete({id:invitation.id})
          this._sendNotfication(invitation.sender.id,`${invitation.reciever.firstName} ${invitation.reciever.lastName} refused your invitation `)
          return "the invitation has been refused";
          
      }
      
       
        const teamRepository = manager.getRepository(TeamEntity);
      
     
      
        const studentRepository = manager.getRepository(StudentEntity);
        let newTeamCreated = false;
        if(!invitation.sender.team){
            const teamLength:number = await teamRepository.count();
            newTeamCreated = true;
            const newTeam = teamRepository.create({nickName:'team'+teamLength,teamLeader:invitation.sender});
            await teamRepository.save(newTeam);
            invitation.reciever.team = newTeam;
            invitation.sender.team = newTeam;
            await studentRepository.save(invitation.reciever);
            await studentRepository.save(invitation.sender);

        }else{
            invitation.reciever.team = invitation.sender.team;
            await studentRepository.save(invitation.reciever)
           
           
        }
        await invitationsRepository.delete({id:invitation.id})
        let outputMessage = `invitation has been accepted`;
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
   async _sendNotfication(studentId:string,description:string){          
       // get the notification repository
         const manager = getManager();
            //get student repository    
            const studentRepository = manager.getRepository(StudentEntity);
            const student = await studentRepository.findOne({id:studentId});
            if(!student){
                Logger.error("student not found",'UserService/sendNotfication') 
                throw new HttpException("student not found",HttpStatus.BAD_REQUEST);
            }
            const notificationRepository = manager.getRepository(NotificationEntity);
            const notification = notificationRepository.create({description,student,seen:false});
            await notificationRepository.save(notification);
            return `notification sent with success to: ${student.firstName+' '+student.lastName}`;
            
}  
    async _sendTeamNotfication(teamId:string,description:string,expectStudentId?:string,expectMessage?:string){    
        const manager = getManager();
        const teamRepository = manager.getRepository(TeamEntity);
        const team = await teamRepository.findOne({id:teamId  },  {relations:['students']});
        if(!team){
            Logger.error("the student is not a member in a team",'UserService/sendTeamNotfication')
            throw new HttpException("the student is not a member in a team",HttpStatus.BAD_REQUEST);
        }
        const notificationRepository = manager.getRepository(NotificationEntity);
        for(let student of team.students){
            if(expectStudentId && student.id === expectStudentId){   

                if(expectMessage){  
                    const notification = notificationRepository.create({description:expectMessage,student,seen:false});
                    await notificationRepository.save(notification);
                }
                continue;   
            }

            const notification = notificationRepository.create({description,student,seen:false});
            await notificationRepository.save(notification);
        }
     
        return `notification sent with success to team: ${team.nickName} members` ;   
    }
async  getNotifications(studentId:string){   

    try{

        // get the notification repository
        const manager = getManager();
        //get student repository
        const studentRepository = manager.getRepository(StudentEntity);
        const student = await studentRepository.createQueryBuilder('student').leftJoinAndSelect('student.notifications','notifications').where('student.id = :id',{id:studentId}).getOne();
        if(!student){
            Logger.error("student not found",'UserService/getNotifications')
            throw new HttpException("student not found",HttpStatus.BAD_REQUEST);
        }
      

      return student.notifications;
    }catch(err){
        Logger.error(err,'UserService/getNotifications')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);

    }
}

async createTeamAnnouncement(studentId:string,teamId:string,title:string,description:string){

    try{
        const manager = getManager();
        const teamRepository = manager.getRepository(TeamEntity);
        const team = await teamRepository.findOne({id:teamId},  {relations:['teamLeader']});
        if(!team){
            Logger.error("team not found",'UserService/createTeamAnnouncement')
            throw new HttpException("team not found",HttpStatus.BAD_REQUEST);
        }
        const studentRepository = manager.getRepository(StudentEntity);
        const student = await studentRepository.findOne({id:studentId});
        if(!student){           
            Logger.error("student not found",'UserService/createTeamAnnouncement')
            throw new HttpException("student not found",HttpStatus.BAD_REQUEST);
        }
        if(team.teamLeader.id !== student.id){      
            Logger.error("student is not the team leader",'UserService/createTeamAnnouncement')
            throw new HttpException("student is not the team leader",HttpStatus.BAD_REQUEST);
        }
        const announcementRepository = manager.getRepository(AnnouncementEntity);
        const announcement = announcementRepository.create({title,description,team});
        await announcementRepository.save(announcement);
        return `announcement sent with success to team: ${team.nickName} members`;
    }catch(err){
        Logger.error(err,'UserService/createTeamAnnouncement')
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
async createSurvey(studentId:string ,survey:SurveyDto){
    const {title,description,options} = survey;
    let {period} = survey;
    if(Number.isNaN(period)){
        Logger.error("period is not a number",'UserService/createSurvey')
        throw new HttpException("period is not a number",HttpStatus.BAD_REQUEST);
    }
    

    // // if(period<1 && period >7){
    // //     Logger.error("period must be between 1 and 7",'UserService/createSurvey');
    // //     throw new HttpException("period must be between 1 and 7",HttpStatus.BAD_REQUEST);
    // // }
    // period = period*24*60*60*1000;
    

    try{
        const manager = getManager();
        const studentRepository = manager.getRepository(StudentEntity);
        const student = await studentRepository.findOne({id:studentId},{relations:['team','team.teamLeader']});
        if(!student){       
            Logger.error("student not found",'UserService/createSurvey')
            throw new HttpException("student not found",HttpStatus.BAD_REQUEST);
        }
   
        if(!student.team){
            Logger.error("team not found",'UserService/createSurvey')
            throw new HttpException("team not found",HttpStatus.BAD_REQUEST);
        }
        if(student.team.teamLeader.id !== student.id){  
            Logger.error("student is not the team leader",'UserService/createSurvey')
            throw new HttpException("student is not the team leader",HttpStatus.BAD_REQUEST);
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

        this._sendTeamNotfication(student.team.id,`a new survey has been created a survey with title: ${title}`);
        //running the crun job
        const surveyData = await surveyRepository.findOne({id:survey.id});
        const job = new CronJob(new Date(surveyData.createdAt.getTime()+period),()=>{
            Logger.warn("survey period has ended",'UserService/createSurvey');
            surveyRepository.update({id:surveyData.id},{close:true});
            this._sendTeamNotfication(student.team.id,`the survey with title: ${title} has ended`);
        })
        this.schedulerRegistry.addCronJob(`cron_Job_surveyEnd_${survey.id}`,job);
        job.start();
        return `survey sent with success to team: ${student.team.nickName} members`;
    }catch(err){
        Logger.error(err,'UserService/createSurvey')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);

    } 
}

async submitSurveyAnswer(studentId:string,surveyId:string,optionId:string,argument:string){
    try{
        const manager = getManager();
        const studentRepository = manager.getRepository(StudentEntity);
        const student = await studentRepository.createQueryBuilder('student')
        .innerJoinAndSelect('student.team','team')
        .innerJoinAndSelect('team.surveys','surveys')
        .where('surveys.id = :surveyId',{surveyId})
        .innerJoinAndSelect('surveys.options','options')
        .where('student.id = :studentId',{studentId})
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
        .where('student.id = :studentId',{studentId})
        .andWhere('survey.id = :surveyId',{surveyId})
        .getOne();

     
       
        const surveyParticipant = surveyParticipantRepository.create({survey:student.team.surveys[0],student:student,answer:student.team.surveys[0].options[0],argument});

      
      
        if(!existingSurveyParticipant){
            await surveyParticipantRepository.save(surveyParticipant);
            return "survey answered succesfully"
        }
    
       if(surveyParticipant.answer.id === existingSurveyParticipant.answer.id){
        Logger.error("you've already answered to the survey using that option",'UserService/submitSurvey')
        throw new HttpException("you've already answered to the survey using that option",HttpStatus.BAD_REQUEST);
       }
   
       await surveyParticipantRepository.update({id:existingSurveyParticipant.id},surveyParticipant);
        
      return "answer updated succesfully"
   
        
     
    }catch(err){
        Logger.error(err,'UserService/submitSurvey')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);

    }
       
}

async getSurveys(teamId:string){
    try{
        const manager =     getManager();
        const teamRepository =   manager.getRepository(TeamEntity);
        const team = await teamRepository.findOne({id:teamId},{relations:['surveys']});
        if(!team){
            Logger.error("team not found",'UserService/getSurveys')
            throw new HttpException("team not found",HttpStatus.BAD_REQUEST);
        }
        return team.surveys;
    }catch(err){
        Logger.error(err,'UserService/getSurveys')
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


}
