import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { TeamAnnoncementDocDto } from "src/core/dtos/user.dto";
import { AnnouncementDocumentEntity } from "src/core/entities/announcement.document.entity";
import { AnnouncementEntity } from "src/core/entities/announcement.entity";
import { StudentEntity } from "src/core/entities/student.entity";
import { UserService } from "src/user/user.service";
import { getManager } from "typeorm";


@Injectable()
export class TeamAnnouncementService{
    constructor(
        private readonly userService:UserService,
    ){}
    async createTeamAnnouncement(userId:string,title:string,description:string,documents:TeamAnnoncementDocDto[]){

        try{
            const manager = getManager()
            const student = await manager.getRepository(StudentEntity)
            .createQueryBuilder('student')
            .where('student.userId = :userId',{userId})
            .innerJoinAndSelect('student.team','team')
            .innerJoinAndSelect('team.teamLeader','teamLeader')
            .andWhere('teamLeader.id = student.id')
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
    
            this.userService._sendTeamNotfication(student.team.id,`a new announcement with  title: ${announcement.title} is available`,student.team.teamLeader.id);
           
        }catch(err){
            Logger.error(err,'UserService/createTeamAnnouncement')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
    
        }
    
    }
    async getAnnouncements(userId:string){
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
}