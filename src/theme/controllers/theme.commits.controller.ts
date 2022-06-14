import { Body, Controller, Get, HttpException, HttpStatus, Logger, Param, Post } from "@nestjs/common";
import { GetCurrentUserId } from "src/common/decorators/get-current-user-id.decorator";
import { ThemeCommitsService } from "../services/theme.commits.service";



@Controller()
export class ThemeCommitsController{
    constructor(
        private readonly themeCommitsService:ThemeCommitsService
    ){}

    @Get('getTeamCommits/:teamId')
    async getTeamCommits(@GetCurrentUserId() userId:string,@Param('teamId') teamId:string){
        try{
            return await this.themeCommitsService.getTeamCommits(userId,teamId)
        }catch(err){
            Logger.error(err,'UserController/getTeamsTeacherResponsibleFor')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }

    @Get('getAllCommitsDocs/:teamId')
    async getAllCommitsDocs(@GetCurrentUserId() userId:string,@Param('teamId') teamId:string){
        try{
           
            console.log('sssssssssssssssssssssss')
            return await this.themeCommitsService.getAllCommitsDocs(userId,teamId)
        }catch(err){
            Logger.error(err,'UserController/getAllCommitsDocs')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }

    @Post('validatedDocument')
    async validatedDocument(@GetCurrentUserId() userId:string,@Body('documentIds') documentIds:string[]){
        try{
          
            return await this.themeCommitsService.validatedDocument(userId,documentIds)
        }catch(err){
            Logger.error(err,'UserController/validatedDocument')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }
    @Get('getAllDocsAdmin/:promotionId/:teamId')
    async getAllDocsAdmin(@GetCurrentUserId() userId:string,@Param('promotionId')promotionId:string,@Param('teamId')teamId:string){
        try{
            return await this.themeCommitsService.getAllDocsAdmin(userId,promotionId,teamId)
        }catch(err){
            Logger.error(err,'UserController/getAllDocsAdmin')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }
}