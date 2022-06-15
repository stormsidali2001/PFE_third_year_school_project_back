import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { GetCurrentUserId } from "src/common/decorators/get-current-user-id.decorator";
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
    async equilibrer(@GetCurrentUserId() userId,@Body("promotionId") promotionId:string){
        
        return await this.teamService.completeTeams(userId,promotionId);
    }
}