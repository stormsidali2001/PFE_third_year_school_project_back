import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InvitationEntity } from "src/core/entities/invitation.entity";
import { StudentEntity } from "src/core/entities/student.entity";
import { TeamEntity } from "src/core/entities/team.entity";
import { SocketService } from "src/socket/socket.service";
import { UserService } from "src/user/user.service";
import { getConnection, getManager } from "typeorm";
import { Server } from 'ws';





@Injectable()
export class TeamInvitationService{
    constructor(
        private readonly userService:UserService,
        private socketService:SocketService
    ){}
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
            this.userService._sendNotficationStudent(reciever.id,`vous avez une nouvelle invitation de jointure de ${sender.firstName} ${reciever.lastName}`)
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
            const manager = getManager();

            let outputMessage = `invitation has been accepted`;
            const invitationsRepository = manager.getRepository(InvitationEntity);
            
            
            invitation = await invitationsRepository
             .createQueryBuilder('invitation')
             .leftJoinAndSelect('invitation.sender','sender')
             .leftJoinAndSelect('invitation.reciever','reciever')
             .leftJoinAndSelect('sender.team','steam')
             .leftJoinAndSelect('reciever.team','rteam')
             .leftJoinAndSelect('reciever.user','ruser')
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
          this.userService._sendNotficationStudent(invitation.sender.id,`${invitation.reciever.firstName} ${invitation.reciever.lastName} refused your invitation `)
          return "the invitation has been refused";
          
        }
      
      
       
      
      
     
      
     
        await getConnection().transaction(async manager=>{
        if(!invitation.sender.team){
            const teamRepository =  manager.getRepository(TeamEntity);
            const studentRepository = manager.getRepository(StudentEntity);
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
            await manager.getRepository(StudentEntity).save(invitation.reciever)
        }

        await invitationsRepository.createQueryBuilder()
        .delete()
        .where('invitation.recieverId = :recieverId',{recieverId:invitation.reciever.id})
        .execute()
    })

     
        if(newTeamCreated){

            outputMessage += `\n team: ${invitation.sender.team.nickName} was created.`
            await this.userService._sendTeamNotfication(invitation.sender.team.id,`you are now in the new team: ${invitation.sender.team.nickName} .`)
            const socket = this.socketService.socket as Server;
            await socket.to(invitation.reciever.user.id).emit("refresh")
            
        }else{
            outputMessage += `\n ${invitation.reciever.firstName +' '+invitation.reciever.lastName} joined the ${invitation.reciever.team.nickName}.`
            await this.userService._sendTeamNotfication(invitation.sender.team.id,`${invitation.reciever.firstName} ${invitation.reciever.lastName} joined your team`,invitation.reciever.id,`you joined the team: ${invitation.sender.team.nickName} successfully...`);
           
           
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


    // only for tests-----------------------------------------------
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
   
}