import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { CommitDocumentEntity } from "src/core/entities/commit.document.entity";
import { CommitEntity } from "src/core/entities/commit.entity";
import { UserEntity, UserType } from "src/core/entities/user.entity";
import { getManager } from "typeorm";


@Injectable()
export class ThemeCommitsService{
    async getTeamCommits(userId:string,teamId:string){
        try{
            const manager = getManager()
    
       
    
            return   await manager.getRepository(CommitEntity)
            .createQueryBuilder('commit')
            .where('commit.teamId = :teamId',{teamId})
            .orderBy("commit.createdAt","DESC")
            .leftJoinAndSelect('commit.documents','documents')
            .leftJoinAndSelect('documents.type','type')
            .innerJoin('commit.team','team')
            .innerJoin('team.responsibleTeachers','responsibleTeachers')
            .innerJoin('responsibleTeachers.teacher','teacher')
            .andWhere('teacher.userId = :userId',{userId})
            .getMany()
    
    
       
        }catch(err){
            Logger.error(err,'UserService/getTeamsTeacherResponsibleFor')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
    
        }
    }
    async getAllCommitsDocs(userId:string,teamId:string){
        try{
            const manager = getManager()
    
       
    
            return   await manager.getRepository(CommitDocumentEntity)
            .createQueryBuilder('document')
            .leftJoinAndSelect('document.type','type')
            .innerJoin('document.commit','commit')
            .where('commit.teamId = :teamId',{teamId})
            .innerJoin('commit.team','team')
            .innerJoin('team.responsibleTeachers','responsibleTeachers')
            .innerJoin('responsibleTeachers.teacher','teacher')
            .andWhere('teacher.userId = :userId',{userId})
            .getMany()
    
       
        }catch(err){
            Logger.error(err,'UserService/getTeamsTeacherResponsibleFor')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
    
        }
    
    }
    
    async validatedDocument(userId:string,documentIds:string[]){
        try{
            const manager = getManager();
           const documents =  await manager.getRepository(CommitDocumentEntity)
            .createQueryBuilder('document')
            .where('document.id  in  (:...documentIds)',{documentIds})
            .innerJoin('document.commit','commit')
            .innerJoin('commit.team','team')
            .innerJoin('team.responsibleTeachers','responsibleTeachers')
            .innerJoin('responsibleTeachers.teacher','teacher')
            .andWhere('teacher.userId = :userId',{userId})
            .getMany()
        
    
            if(documents.length < documentIds.length || documents.some(doc=>doc.validated)){
                Logger.error("Permission denied",'UserService/getTeamsTeacherResponsibleFor')
                throw new HttpException("Permission denied",HttpStatus.BAD_REQUEST);
            }
    
            await manager.getRepository(CommitDocumentEntity)
            .createQueryBuilder() 
            .update()
            .set({validated:true})
            .where('commit_document.id  in  (:...documentIds)',{documentIds})
            .execute()
    
    
     
    
        }catch(err){
            Logger.log(err,'UserService/validateDocument')
            throw new HttpException(err,HttpStatus.BAD_REQUEST)
        }
    }
    async getAllDocsAdmin(userId:string,promotionId:string,teamId:string){
        try{
            const manager = getManager()
    
            const user = await manager.getRepository(UserEntity)
            .createQueryBuilder('user')
            .where('user.id = :userId',{userId})
            .andWhere('user.userType = :userType',{userType:UserType.ADMIN})
            .getOne()
    
            if(!user){
                Logger.error("perssion denied",'UserService/getAllDocsAdmin')
                throw new HttpException("perssion denied",HttpStatus.BAD_REQUEST);
            }
    
            let query  =  manager.getRepository(CommitDocumentEntity)
            .createQueryBuilder('document')
            .where('document.validated = true')
            .leftJoinAndSelect('document.type','type')
            .innerJoinAndSelect('document.commit','commit')
            .innerJoinAndSelect('commit.team','team')
            .innerJoinAndSelect('team.promotion','promotion')
           
            
            if(promotionId!== 'all'){
                query= query
                .andWhere('promotion.id = :promotionId',{promotionId})
                
                
            }
    
            if(teamId !== 'all'){
                query= query
                .andWhere('team.id = :teamId',{teamId})
                
            }
    
            return await query.getMany();
    
       
        }catch(err){
            Logger.error(err,'UserService/getAllDocsAdmin')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
    
        }
    }
}