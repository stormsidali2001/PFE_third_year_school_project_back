import { Body, Controller, HttpException, HttpStatus, Logger, Post } from "@nestjs/common";
import { GetCurrentUserId } from "src/common/decorators/get-current-user-id.decorator";
import { ThemeToTeamDTO } from "src/core/dtos/user.dto";
import { ThemeAssignementService } from "../services/theme.assignement.service";


@Controller()
export class ThemeAssignementController{
    constructor(
        private readonly themeAssignementService:ThemeAssignementService
    ){}
    
    @Post('asignThemesToTeams')
    async asignThemesToTeams(@GetCurrentUserId() userId:string,@Body('promotionId') promotionId:string,@Body('method') method:string){
        try{
            return await this.themeAssignementService.asignThemesToTeams(userId,promotionId,method)
        }catch(err){
            Logger.error(err,'UserController/asignThemesToTeams')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }
    
    @Post('applyThemesToTeamsAssignements')
    async applyThemesToTeamsAssignements(userId:string,@Body()data:ThemeToTeamDTO){
        try{
            return await this.themeAssignementService.applyThemesToTeamsAssignements(userId,data)
        }catch(err){
            Logger.error(err,'UserController/applyThemesToTeamsAssignements')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }

    }
}