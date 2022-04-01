import { Body, Controller, Get, HttpException, HttpStatus, Logger, Param, ParseBoolPipe, Post } from "@nestjs/common";
import { NormalTeamMeetDto, SurveyDto, UrgentTeamMeetDto } from "src/core/dtos/user.dto";

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
        @Body('accepted',ParseBoolPipe) accepted:boolean,
        @Body('recieverId') recieverId:string 
        
    ){
      
        return this.userService.acceptRefuseTeamInvitation(invitationId,recieverId,accepted);
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
                                @Body('message') message:string) {
        try{
            return await this.userService.sendTeamChatMessage(studentId,message);
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
    @Post('submitSurveyAnswer')
    async submitSurveyAnswer( @Body('studentId') studentId:string,
                                @Body('surveyId') surveyId:string,
                                @Body('optionId') optionId:string,
                                @Body('argument') argument:string
                                ){
        try{
            return await this.userService.submitSurveyAnswer(studentId,surveyId,optionId,argument);
        }catch(err){
            Logger.error(err,'UsrController/submitSurveyAnswer')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }

    @Get('surveys/:teamId')
    async getSurveys(@Param('teamId') teamId:string){
            try{
                return await this.userService.getSurveys(teamId);
            }catch(err){
                Logger.error(err,"UserController/getSurveys");
                throw new HttpException(err,HttpStatus.BAD_REQUEST)
            }
    }
    @Post('createUrgentTeamMeet')
    async createUrgentTeamMeet(@Body('studentId')studentId:string,@Body('meet')meet:UrgentTeamMeetDto){
        try{
            return await this.userService.createUrgentTeamMeet(studentId,meet);
        }catch(err){
            Logger.error(err,'UserController/createUrgentTeamMeet')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }
    @Post('createNormalTeamMeet')
    async createNormalTeamMeet(@Body('studentId')studentId:string,@Body('meet')meet:NormalTeamMeetDto){
        try{
            return await this.userService.createNormalTeamMeet(studentId,meet);
        }catch(err){
            Logger.error(err,'UserController/createNormalTeamMeet')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }
  
}