import { Body, Controller, Get, HttpException, HttpStatus, Logger, Post } from "@nestjs/common";
import { GetCurrentUserId } from "src/common/decorators/get-current-user-id.decorator";
import { TeamChatService } from "../services/team.chat.service";




@Controller()
export class TeamChatController{
    constructor(
       private readonly teamChatService:TeamChatService
    ){}

    @Post('sendTeamChatMessage')
    async sendTeamChatMessage(  @Body('studentId') studentId :string,
                                @Body('message') message:string) {
        try{
            return await this.teamChatService.sendTeamChatMessage(studentId,message);
        }catch(err){
            Logger.error(err,'UsrController/sendTeamChatMessage')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);

        }
    }    
    
    @Get('getTeamMessages')
    async getTeamMessages(@GetCurrentUserId() userId:string){
        return await this.teamChatService.getTeamMessages(userId)
    }

}