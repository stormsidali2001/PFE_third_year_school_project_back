import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { GetCurrentUserId } from "src/common/decorators/get-current-user-id.decorator";
import { ApplyTeamsCompletionDTO } from "src/core/dtos/user.dto";
import { TeamService } from "../services/team.service";



@Controller()
export class TeamController{
    constructor(
        private readonly teamService:TeamService
    ){}
    @Get("getTeamsStats/:promotionId")
    async getTeamsStats(@GetCurrentUserId() userId:string,@Param("promotionId") promotionId:string){
        return await this.teamService.getTeamsStats(userId,promotionId);

    }
    @Post('completeTeams')
    async completeTeams(@GetCurrentUserId() userId,@Body("promotionId") promotionId:string){
        
        return await this.teamService.completeTeams(userId,promotionId);
    }
    @Post('applyTeamsCompletion')
    async applyTeamsCompletion(@GetCurrentUserId() userId:string,
    @Body("promotionId") promotionId:string,@Body() applyTeamsCompletionPayload:ApplyTeamsCompletionDTO){
        return await this.teamService.applyTeamsCompletion(userId,promotionId,applyTeamsCompletionPayload);
    }
}