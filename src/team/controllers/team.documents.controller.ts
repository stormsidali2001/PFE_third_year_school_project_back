import { Body, Controller, Get, HttpException, HttpStatus, Logger, Post } from "@nestjs/common";
import { GetCurrentUserId } from "src/common/decorators/get-current-user-id.decorator";
import { TeamDocumentsService } from "../services/team.documents.service";



@Controller()
export class TeamDocumentsController{
    constructor(
        private readonly teamDocumentsService:TeamDocumentsService
    ){}

    @Post('addTeamDocument')
    async addTeamDocument(
        @GetCurrentUserId() userId:string,
        @Body('name') name:string,
        @Body('url') url:string,
        @Body('description') description:string,
        @Body('typeDocId') typeDocId:string
    ){
        try{
            return await this.teamDocumentsService.addTeamDocument(userId,name,url,description,typeDocId);
        }catch(err){
            Logger.error(err,'UserController/addTeamDocument')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
        
    }
    @Get('getTeamDocuments')
    async getDocuments(@GetCurrentUserId() userId:string){
        try{
            return await this.teamDocumentsService.getTeamDocuments(userId);
        }catch(err){
            Logger.error(err,'UserController/getTeamDocuments')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }
    @Post('deleteTeamDocs')
    async deleteTeamDocs(
        @GetCurrentUserId() userId:string,
        @Body('docsIds') docsIds:string[]
        ){
            try{
                return await this.teamDocumentsService.deleteTeamDocs(userId,docsIds);
            }catch(err){
                Logger.error(err,'UserController/deleteTeamDocs')
                throw new HttpException(err,HttpStatus.BAD_REQUEST);
            }
        }
    @Post('updateTeamDocument')
    async updateTeamDocument(
           @GetCurrentUserId() userId:string,
           @Body("documentId") documentId:string,
           @Body("description") description:string,
           @Body("name")  name:string,
           @Body("documentTypeId") documentTypeId:string
            ){
                try{    
                    return await this.teamDocumentsService.updateTeamDocument(userId,documentId,description,name,documentTypeId);

                }catch(err){
                    Logger.error(err,'UserController/updateDocument');
                    throw new HttpException(err,HttpStatus.BAD_REQUEST);
                }

     }
    @Post('commitDocs')
    async commitDocs(@GetCurrentUserId() userId:string,@Body('title') title:string,@Body('description') description:string,@Body('docsIds')docsIds:string[]){
        try{
            return await this.teamDocumentsService.commitDocs(userId,title,description,docsIds);
        }catch(err){
            Logger.error(err,'UserController/commitDocs')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }

    }
}