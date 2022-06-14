import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { StudentEntity } from "src/core/entities/student.entity";
import { TeamChatMessageEntity } from "src/core/entities/team.chat.message.entity";
import { getManager } from "typeorm";


@Injectable()
export class TeamChatService{
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
}