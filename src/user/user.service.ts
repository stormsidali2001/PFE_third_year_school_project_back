import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { SurveyDto } from "src/core/dtos/user.dto";
import { AnnouncementEntity } from "src/core/entities/announcement.entity";
import { InvitationEntity } from "src/core/entities/invitation.entity";
import { NotificationEntity } from "src/core/entities/Notification.entity";
import { StudentEntity } from "src/core/entities/student.entity";
import { SurveyEntity } from "src/core/entities/survey.entity";
import { SurveyOptionEntity } from "src/core/entities/survey.option.entity";
import { TeamChatMessageEntity } from "src/core/entities/team.chat.message.entity";
import { TeamEntity } from "src/core/entities/team.entity";
import { UserEntity, UserType } from "src/core/entities/user.entity";
import { getManager } from "typeorm";
@Injectable()
export class UserService{
    
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

    async acceptRefuseTeamInvitation(invitationId:string,accepted:boolean){
     
        /**
         * team leader/student sends an invitation request to a student without a team
         * 
         */
     
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
      
      if(!accepted){
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
                Logger.error(`invitations related to: ${student.firstName+' '+student.lastName}`,'UserService/getInvitations')
                throw new HttpException(`invitations related to: ${student.firstName+' '+student.lastName}`,HttpStatus.BAD_REQUEST);
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
            Logger.error("team not found",'UserService/sendTeamNotfication')
            throw new HttpException("team not found",HttpStatus.BAD_REQUEST);
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
        const student = await studentRepository.findOne({id:studentId});
        if(!student){
            Logger.error("student not found",'UserService/getNotifications')
            throw new HttpException("student not found",HttpStatus.BAD_REQUEST);
        }
        const notificationRepository = manager.getRepository(NotificationEntity);
        const notifications = await notificationRepository.find({student:student});

      return notifications;
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
async sendTeamChatMessage(studentId:string,teamId:string,message:string){

    try{
        const manager = getManager();
        const teamRepository = manager.getRepository(TeamEntity);
        const team = await teamRepository.findOne({id:teamId});
        if(!team){
            Logger.error("team not found",'UserService/sendTeamChatMessage')
            throw new HttpException("team not found",HttpStatus.BAD_REQUEST);
        }
        const studentRepository = manager.getRepository(StudentEntity);
        const student = await studentRepository.findOne({id:studentId});
        if(!student){           
            Logger.error("student not found",'UserService/sendTeamChatMessage')
            throw new HttpException("student not found",HttpStatus.BAD_REQUEST);
        }
       
        const chatRepository = manager.getRepository(TeamChatMessageEntity);
        const chat = chatRepository.create({message,team,owner:student});
        await chatRepository.save(chat);
        return `message sent with success to team: ${team.nickName} members`;
    }catch(err){
        Logger.error(err,'UserService/sendTeamChatMessage')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);

    }

}
async createSurvey(studentId:string ,survey:SurveyDto){
    const {title,description,period,teamId,options,close} = survey;

    try{
        const manager = getManager();
        const teamRepository = manager.getRepository(TeamEntity);
        const team = await teamRepository.findOne({id:teamId},{ relations:['teamLeader']});
        if(!team){
            Logger.error("team not found",'UserService/createSurvey')
            throw new HttpException("team not found",HttpStatus.BAD_REQUEST);
        }
        const studentRepository = manager.getRepository(StudentEntity);
        const student = await studentRepository.findOne({id:studentId});
        if(!student){       
            Logger.error("student not found",'UserService/createSurvey')
            throw new HttpException("student not found",HttpStatus.BAD_REQUEST);
        }
        if(team.teamLeader.id !== student.id){  
            Logger.error("student is not the team leader",'UserService/createSurvey')
            throw new HttpException("student is not the team leader",HttpStatus.BAD_REQUEST);
        }
        const surveyRepository = manager.getRepository(SurveyEntity);
        const surveyOptionRepository = manager.getRepository(SurveyOptionEntity);
        const survey = surveyRepository.create({title,description,period,team,close});
        await surveyRepository.save(survey);
            for(let key in options){
                const {description} = options[key];
                const surveyOption = surveyOptionRepository.create({description,survey});
                await surveyOptionRepository.save(surveyOption);
            }

        this._sendTeamNotfication(team.id,`a new survey has been created a survey with title: ${title}`);
        return `survey sent with success to team: ${team.nickName} members`;
    }catch(err){
        Logger.error(err,'UserService/createSurvey')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);

    }
}


}
