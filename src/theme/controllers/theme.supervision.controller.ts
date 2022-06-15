import { Body, Controller, Get, HttpException, HttpStatus, Logger, Param, Post } from "@nestjs/common";
import { GetCurrentUserId } from "src/common/decorators/get-current-user-id.decorator";
import { Public } from "src/common/decorators/public.decorator";
import { ThemeToTeamDTO } from "src/core/dtos/user.dto";
import { ThemeSupervisionService } from "../services/theme.supervision.service";




@Controller()
export class ThemeSupervisionController{
    constructor(
        private readonly themeSupervisionService:ThemeSupervisionService
    ){

    }

    @Post('encadrerTheme')
    async encadrerTheme(@GetCurrentUserId() userId:string,@Body('themeId') themeId:string,@Body('teacherId')teacherId:string){
        try{
            return await this.themeSupervisionService.encadrerTheme(userId,themeId,teacherId)
        }catch(err){
            Logger.error(err,'UserController/encadrerTheme')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }

    }

    @Post('assignTeamsToTeacher')
    async assignTeamsToTeacher(@GetCurrentUserId() userId:string,@Body('teamIds') teamIds:string[],@Body('teacherId') teacherId:string){
            try{
                return await this.themeSupervisionService.assignTeamsToTeacher(userId,teamIds,teacherId)
            }catch(err){
                Logger.error(err,'UserController/assignTeamsToTeacher')
                throw new HttpException(err,HttpStatus.BAD_REQUEST);
            }
    }
    @Get('getTeamsTeacherResponsibleFor')
    async getTeamsTeacherResponsibleFor(@GetCurrentUserId() userId:string){
        try{
            return await this.themeSupervisionService.getTeamsTeacherResponsibleFor(userId)
        }catch(err){
            Logger.error(err,'UserController/getTeamsTeacherResponsibleFor')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }
    @Get('getTeamsTeacherResponsibleForWithMembers/:promotionId')
    async getTeamsTeacherResponsibleForWithMembers(@GetCurrentUserId() userId:string,@Param('promotionId') promotionId:string){
        try{
          
            return await this.themeSupervisionService.getTeamsTeacherResponsibleForWithMembers(userId,promotionId)
        }catch(err){
            Logger.error(err,'UserController/getTeamsTeacherResponsibleFor')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }
    @Public()
    @Get('getTeamsWithThemes/:promotionId')
    async getTeamsithThemes(@Param('promotionId') promotionId:string){
        return await this.themeSupervisionService.getTeamsithThemes(promotionId)
    }
    @Post('canSoutenir')
    async canSoutenir(@GetCurrentUserId() userId:string,@Body('teamId') teamId:string){
        try{
            return await this.themeSupervisionService.canSoutenir(userId,teamId);
        }catch(err){
            Logger.error(err,'UserController/sendNotifications')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }

}