import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InvitationEntity } from "src/core/entities/invitation.entity";
import { StudentEntity } from "src/core/entities/student.entity";
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
        const manager = getManager();
        try{
            const sender = await manager.getRepository(StudentEntity).findOne({id:senderId},{relations:['team','sentInvitations']})

            const reciever =  await manager.getRepository(StudentEntity).findOne({id:recieverId},{relations:['team','sentInvitations']});

            if(reciever.team ){
                throw new HttpException("le destinataire doit etre sans equipe.",HttpStatus.BAD_REQUEST)
            }

            const invitationsRepository = manager.getRepository(InvitationEntity);
            const invitation = invitationsRepository.create({description,sender,reciever,accepted:false});
            await invitationsRepository.save(invitation);
            return JSON.stringify({sender,reciever,description}) ;
        }catch(err){
            Logger.error(err,'UserService/sendATeamInvitation')
        }

      

    }
}