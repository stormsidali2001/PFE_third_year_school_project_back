import { Body, Controller, Get, HttpException, HttpStatus, Logger, Param, ParseBoolPipe, ParseIntPipe, Post, Res, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { GetCurrentUserId } from "src/common/decorators/get-current-user-id.decorator";
import { Public } from "src/common/decorators/public.decorator";
import { editFileName } from "src/common/utils/files-middalewares";
import { NormalTeamMeetDto, SurveyDto, TeamAnnoncementDocDto, UrgentTeamMeetDto } from "src/core/dtos/user.dto";

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
        @GetCurrentUserId() userId:string,
        @Body('recieverId') recieverId:string,
    @Body('description') description:string
    ){
        Logger.log({recieverId,description},'UserController/sendATeamInvitation')

        return await this.userService.sendATeamInvitation(userId,recieverId,description);
    }

    @Post('/acceptRefuseTeamInvitation')
    async acceptRefuseTeamInvitation(
        @Body('invitationId') invitationId:string ,
        @Body('accepted',ParseBoolPipe) accepted:boolean,
       @GetCurrentUserId() userId:string 
        
    ){
      
        return this.userService.acceptRefuseTeamInvitation(invitationId,userId,accepted);
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
    async createTeamAnnouncement(@GetCurrentUserId() userId:string,
                                @Body('title') title:string,
                                @Body('description') description:string,
                                @Body('documents') documents:TeamAnnoncementDocDto[]
                                ){        
        try{
            Logger.error(title,"*****555****")
            return await this.userService.createTeamAnnouncement(userId,title,description,documents);
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
    async createSurvey(@GetCurrentUserId() userId:string,@Body('survey') survey:SurveyDto){
       
        try{
            return await this.userService.createSurvey(userId,survey);
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

    @Get('notifications/:number')
    async getLastNotifications(@GetCurrentUserId() userId:string,   @Param('number',ParseIntPipe) number:number){
        try{
            return await this.userService.getLastNotifications(userId,number);
        }catch(err){
            Logger.error(err,'UserController/getNotifications')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }

   
    @Get('getStudentsWithoutTeam')
    async getStudentsWithoutTeam(@GetCurrentUserId() userId:string){
        try{
            return await this.userService.getStudentsWithoutTeam(userId)
        }catch(err){
            Logger.error(err,'UserController/getStudentsWithoutTeam')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }

    @Get('getInvitationList')
    async getInvitationList(@GetCurrentUserId() userId:string){
        try{
            return await  this.userService.getInvitationList(userId);
        }catch(err){
            Logger.error(err,'UserController/getInvitationList')
        }
    }


    @Post('uploadFile')
    @UseInterceptors(FileInterceptor('file',{
        storage: diskStorage({
            destination: './files',
            filename: editFileName,
           
          }),
    }))
    async uploadFile(@UploadedFile() file:Express.Multer.File){
      
        const response = {
            originalname: file.originalname,
            filename: file.filename,
        };
        Logger.warn("file uploaded",response);
        return response;
    }
    
    @Get('getFile/:path')
    seeUploadedFile(@Param('path') path, @Res() res) {
        return res.sendFile(path, { root: './files' });
    }


  
    @Post('uploadFiles')
    @UseInterceptors(FilesInterceptor('files',10,{
        storage: diskStorage({
            destination: './files',
            filename: editFileName,
           
          }),
    }))
    async uploadFiles(@UploadedFiles() files:Express.Multer.File[]){
        const response = [];
      
        files.forEach(file => {
          const fileReponse = {
            originalname: file.originalname,
            filename: file.filename,
            destination:file.destination
          };
          response.push(fileReponse);
        });
        Logger.warn("files uploaded",response);
        return response;
    }


    //test routes---------------------------
    @Public()
    @Post('test/sendNotification')
    async sendNotification(@Body('studentId') studentId:string, @Body('description') description:string){
        try{
            return await this.userService._sendNotfication(studentId,description);
        }catch(err){
            Logger.error(err,'UserController/sendNotifications')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }

  

}