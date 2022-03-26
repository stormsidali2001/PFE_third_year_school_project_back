import { Body, Controller, Get, HttpException, HttpStatus, Logger, Param, ParseBoolPipe, Post } from "@nestjs/common";
import { SurveyDto } from "src/core/dtos/user.dto";

import { UserService } from "./user.service";

@Controller()
export class UserController{
    constructor(private readonly userService:UserService) {}
    
    @Post('/user')
    async getUserInfo(@Body('id') id:string){

        return this.userService.getUserInfo(id);
    }
    @Post('/sendATeamInvitation')
    async sendATeamInvitation(
        @Body('senderId') senderId:string,
        @Body('receiverId') receiverId:string,
    @Body('description') description:string
    ){

        return this.userService.sendATeamInvitation(senderId,receiverId,description);
    }

    @Post('/acceptRefuseTeamInvitation')
    async acceptRefuseTeamInvitation(
        @Body('invitationId') invitationId:string ,
        @Body('accepted',ParseBoolPipe) accepted:boolean 
        
    ){
      
        return this.userService.acceptRefuseTeamInvitation(invitationId,accepted);
    }

    @Post('/sendTeamJoinRequest')
    async sendTeamJoinRequest(@Body('senderId') senderId:string,@Body('teamId') teamId:string,@Body('description') description:string){
         return this.userService.sendTeamJoinRequest(senderId,teamId,description)
    }
    @Get('/invitations/:studentId')
    async getInvitations(@Param('studentId') studentId:string){
        try{

            return await this.userService.getInvitations(studentId);
        }catch(err){
            Logger.error(err,'UsrController/getInvitations')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }

    }
    @Post('/createTeamAnnouncement')
    async createTeamAnnouncement(@Body('studentId') studentId:string,
                                @Body('teamId') teamId:string,
                                @Body('title') title:string,
                                @Body('description') description:string
                                ){        
        try{
            return await this.userService.createTeamAnnouncement(studentId,teamId,title,description);
        }catch(err){
            Logger.error(err,'UsrController/createTeamAnnouncement')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }
    @Post('sendTeamChatMessage')
    async sendTeamChatMessage(  @Body('studentId') studentId :string,
                                @Body('teamId') teamId:string,
                                @Body('message') message:string) {
        try{
            return await this.userService.sendTeamChatMessage(studentId,teamId,message);
        }catch(err){
            Logger.error(err,'UsrController/sendTeamChatMessage')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }          
    @Post('createSurvey')
    async createSurvey(@Body('studentId') studentId:string,@Body('survey') survey:SurveyDto){
        try{
            return await this.userService.createSurvey(studentId,survey);
        }catch(err){
            Logger.error(err,'UsrController/createSurvey')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }
  
}