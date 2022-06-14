import { Body, Controller, Get, HttpException, HttpStatus, Logger, Post } from "@nestjs/common";
import { GetCurrentUserId } from "src/common/decorators/get-current-user-id.decorator";
import { TeamAnnoncementDocDto } from "src/core/dtos/user.dto";
import { TeamAnnouncementService } from "../services/team.announcement.service";



@Controller()
export class TeamAnnouncementController{
    constructor(
        private readonly teamAnnouncementService:TeamAnnouncementService
    ){}
    @Get('getAnnouncements')
    async getAnnouncements(@GetCurrentUserId() userId:string){
        try{
            return await this.teamAnnouncementService.getAnnouncements(userId)
        }catch(err){
            Logger.error(err,'UsrController/createSurvey')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }
    @Post('/createTeamAnnouncement')
    async createTeamAnnouncement(@GetCurrentUserId() userId:string,
                                @Body('title') title:string,
                                @Body('description') description:string,
                                @Body('documents') documents:TeamAnnoncementDocDto[]
                              
                                
                                ){        
                                    Logger.error(documents,"*****555****")
        try{
            return await this.teamAnnouncementService.createTeamAnnouncement(userId,title,description,documents);
        }catch(err){
            Logger.error(err,'UsrController/createTeamAnnouncement')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }

}