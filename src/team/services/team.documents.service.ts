import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { Server } from "ws";
import { DocumentTypeEntity } from "src/core/entities/document-types.entity";
import { TeamDocumentEntity } from "src/core/entities/team.document.entity";
import { TeamEntity } from "src/core/entities/team.entity";
import { SocketService } from "src/socket/socket.service";
import { UserService } from "src/user/user.service";
import { getConnection, getManager } from "typeorm";
import * as fs from 'fs';
import * as path from "path";
import { StudentEntity } from "src/core/entities/student.entity";
import { ResponsibleEntity } from "src/core/entities/responsible.entity";
import { CommitEntity } from "src/core/entities/commit.entity";
import { CommitDocumentEntity } from "src/core/entities/commit.document.entity";



@Injectable()
export class TeamDocumentsService{

    constructor(
        private readonly userService:UserService,
        private socketService:SocketService

    ){}

    async addTeamDocument(userId:string,name:string,url:string,description:string,typeDocId:string){
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
    
            const type = await manager.getRepository(DocumentTypeEntity)
            .createQueryBuilder('type')
            .where('type.id = :typeDocId',{typeDocId})
            .getOne()
    
            if(!type){
                Logger.error("type not found",'UserService/addTeamDocument')
                throw new HttpException("type not found",HttpStatus.BAD_REQUEST);
            }
    
            const teamDocumentRepository = manager.getRepository(TeamDocumentEntity);
            const teamDocument = teamDocumentRepository.create({name,url,team,description,owner:team.students[0],type})
    
             manager.getRepository(TeamDocumentEntity)
            .createQueryBuilder('teamDoc')
            .insert()
            .values(teamDocument)
            .execute()
    
            const socket = this.socketService.socket as Server;
            socket.to(team.id).emit("team-documents-alltered");
    
    
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
            .leftJoinAndSelect('document.type','type')
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
    
            const socket = this.socketService.socket as Server;
            socket.to(team.id).emit("team-documents-alltered");
            
    
        }catch(err){
            Logger.error(err,'UserService/deleteTeamDocs')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
    
        }
    
    }
    async updateTeamDocument(userId:string,documentId:string,description:string,name:string,documentTypeId:string){
        try{
          
            const manager = getManager();
            const document = await manager.getRepository(TeamDocumentEntity)
            .createQueryBuilder('document')
            .where('document.id = :documentId',{documentId})
            .leftJoinAndSelect('document.owner','owner')
            .innerJoinAndSelect('document.team','team')
            .innerJoinAndSelect('team.students','students')
            .andWhere('students.userId = :userId',{userId})
            .leftJoinAndSelect('team.teamLeader','teamLeader')
            .getOne();
            if(!document){
                Logger.error("document not found",'UserService/updateDocument')
                  throw new HttpException("document not found",HttpStatus.BAD_REQUEST);
            }
           
            const isTeamLeader = document.team.teamLeader.id === document.team.students[0].id;
            const isOwner = document.team.students[0].id === document.owner.id;
            if(!isTeamLeader && !isOwner){
                Logger.error("permission denied",'UserService/updateDocument')
                throw new HttpException("permission denied",HttpStatus.BAD_REQUEST);
            }
            const documentType = await manager.getRepository(DocumentTypeEntity)
            .createQueryBuilder("docType")
            .where("docType.id = :documentTypeId",{documentTypeId})
            .getOne();
            if(!documentType){
                Logger.error("document type not found",'UserService/updateDocument')
                  throw new HttpException("document type not found",HttpStatus.BAD_REQUEST);
            }
    
    
    
            await manager.getRepository(TeamDocumentEntity)
            .createQueryBuilder('document')
            .update()
            .set({description,name,type:documentType})
            .where('team_document.id = :documentId',{documentId})
            .execute();
    
            const socket = this.socketService.socket as Server;
            socket.to(document.team.id).emit("team-documents-alltered");
    
            
        }catch(err){
            Logger.error(err,'UserService/updateDocument')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }
    async commitDocs(userId:string,title:string,description:string,docsIds:string[]){
        try{
            const manager = getManager();
    
            const student = await manager.getRepository(StudentEntity)
            .createQueryBuilder('student')
            .where('student.userId = :userId',{userId})
            .innerJoinAndSelect('student.team','team')
            .innerJoin('team.teamLeader','teamLeader')
            .andWhere('teamLeader.id = student.id')
            .getOne();
    
            if(!student){
                Logger.error("permission denied",'UserService/commitDocs')
                throw new HttpException("permission denied",HttpStatus.BAD_REQUEST);
            }
           
            const responsibles = await manager.getRepository(ResponsibleEntity)
            .createQueryBuilder('res')
            .where('res.teamId = :teamId',{teamId:student.team.id})
            .innerJoinAndSelect('res.team','team')
            .innerJoinAndSelect('team.givenTheme','givenTheme')
            .innerJoinAndSelect('givenTheme.encadrement','encadrement')
            .andWhere('encadrement.teacherId = res.teacherId')
            .leftJoinAndSelect('encadrement.teacher','teacher')
            .leftJoinAndSelect('teacher.user','user')
            .getMany();
          
            if(responsibles.length === 0){
                Logger.error("aucun ensignant encadrant le theme donnee a l'equipe est responsable de cette derniere ",'UserService/commitDocs')
                throw new HttpException("aucun ensignant encadrant le theme donnee a l'equipe est responsable de cette derniere ",HttpStatus.BAD_REQUEST);
            }
    
            const teamDocs = await manager.getRepository(TeamDocumentEntity)
            .createQueryBuilder('doc')
            .where('doc.id in (:...docsIds)',{docsIds})
            .andWhere('doc.teamId = :teamId',{teamId:student.team.id})
            .leftJoinAndSelect('doc.type','type')
            .getMany()
         
            if(teamDocs.length !== docsIds.length){
                Logger.error("wrong doc ids",'UserService/commitDocs')
                throw new HttpException("wrong doc ids",HttpStatus.BAD_REQUEST);
            }
            const commit =  manager.getRepository(CommitEntity)
            .create({title,description,team:student.team})
    
          await getConnection().transaction(async manager=>{
    
        
                await manager.getRepository(CommitEntity).save(commit)
            
                const docsToCommit:CommitDocumentEntity[] = [];
                teamDocs.forEach(
                    teamDoc=>{
                       
                    
                       
                        const extension =  teamDoc.url.slice(teamDoc.url.lastIndexOf("."),teamDoc.url.length);
                        const url = './files/'+teamDoc.name+Date.now()+'.'+extension;
                        fs.copyFile(
                            path.resolve(teamDoc.url),
                            path.resolve(url),
                            (err)=>{
    
                                if(err){
                
                                    Logger.error(`failed to copy the document with id: ${teamDoc.id} and url: ${teamDoc.url}`,'UserService/commitDocs ')
                                    console.log(err)
                                
                                    
                                }
                            }
                        ) 
                        const doc = manager.getRepository(CommitDocumentEntity).create({name:teamDoc.name,url,type:teamDoc.type,commit})
                        docsToCommit.push(doc)
                    
                    
                    }
                )
    
                await manager.getRepository(CommitDocumentEntity).save(docsToCommit)
              
                for(let k in responsibles){
                    const res= responsibles[k];
                    const userId = res.teacher.user.id;
                    this.userService._sendNotfication(userId,`l'equipe : ${res.team.nickName} a commiter des nouveaux documents`)

                  
                  
                }
    
        })
         
    
    
    
        }catch(err){
            Logger.error(err,'UserService/commitDocs')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
    
        }
    }
}