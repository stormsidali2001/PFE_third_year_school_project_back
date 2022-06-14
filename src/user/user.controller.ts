import { Body, Controller, Delete, Get, HttpException, HttpStatus, Logger, Param, ParseBoolPipe, ParseIntPipe, Post, Put, Res, StreamableFile, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { GetCurrentUserId } from "src/common/decorators/get-current-user-id.decorator";
import { Public } from "src/common/decorators/public.decorator";
import { editFileName } from "src/common/utils/files-middalewares";
import { NormalTeamMeetDto, SurveyDto, TeamAnnoncementDocDto, UrgentTeamMeetDto , ThemeDocDto, WishListDTO, ThemeToTeamDTO, SoutenanceDto} from "src/core/dtos/user.dto";
import * as fs from 'fs';
import * as path from "path";

import { UserService } from "./user.service";
import { getManager } from "typeorm";
import { UserEntity, UserType } from "src/core/entities/user.entity";
 
@Controller()
export class UserController{
    constructor(private readonly userService:UserService) {}
    
  

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
                                    Logger.error(documents,"*****555****")
        try{
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
    @Get('getSurveyParticipantsArguments/:surveyId/:optionId')
    async getSurveyParticipantsArguments(
        @GetCurrentUserId() userId:string,
        @Param('surveyId') surveyId:string,
        @Param('optionId') optionId:string
    ){
        try{
            return await this.userService.getSurveyParticipantsArguments(userId,surveyId,optionId);
        }catch(err){
            Logger.error(err,'UsrController/createSurvey')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }
    @Get('getAnnouncement')
    async getAnnouncement(@GetCurrentUserId() userId:string){
        try{
            return await this.userService.getAnnouncement(userId)
        }catch(err){
            Logger.error(err,'UsrController/createSurvey')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }
    @Post('submitSurveyAnswer')
    async submitSurveyAnswer( @GetCurrentUserId() userId:string,
                                @Body('surveyId') surveyId:string,
                                @Body('optionId') optionId:string,
                                @Body('argument') argument:string
                                ){
        try{
            return await this.userService.submitSurveyAnswer(userId,surveyId,optionId,argument);
        }catch(err){
            Logger.error(err,'UsrController/submitSurveyAnswer')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }

    @Get('surveys')
    async getSurveys(@GetCurrentUserId() userId:string){
            try{
                return await this.userService.getSurveys(userId);
            }catch(err){
                Logger.error(err,"UserController/getSurveys");
                throw new HttpException(err,HttpStatus.BAD_REQUEST)
            }
    }
    @Get('surveys/:surveyId')
    async getSurvey(@GetCurrentUserId() userId:string,@Param('surveyId') surveyId:string){
            try{
                return await this.userService.getSurvey(userId,surveyId);
            }catch(err){
                Logger.error(err,"UserController/getSurveys");
                throw new HttpException(err,HttpStatus.BAD_REQUEST)
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
            destination:file.destination
        };
        Logger.warn("file uploaded",response);
        return response;
    }

    @Public()
    @Get('files/:url')
    async downlaodFile(@Param('url') url:string,@GetCurrentUserId() userId:string){
   
        try{
            const manager = getManager()
            console.log(url)
            const user = await manager.getRepository(UserEntity)
            .createQueryBuilder('user')
            .where('user.id = :userId',{userId})
            .getOne()
            if(!user){
                Logger.error("permission denied",'UserController/downlaodFile')
            throw new HttpException("permission denied",HttpStatus.BAD_REQUEST);
            }
            const file = fs.readFileSync(path.resolve('./files/'+url))
            return new StreamableFile(file)

        }catch(err){
            Logger.error(err,'UserController/downlaodFile')
            return "file not found"

        }
      
    }
    
    @Get('getFile/:path')
    seeUploadedFile(@Param('path') path, @Res() res) {
        Logger.error("getting file"+path,"debug")
        res.set({
           
            'Content-Disposition': 'attachment; filename="package.json"',
          });
  
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

    @Post('addTeamDocument')
    async addTeamDocument(
        @GetCurrentUserId() userId:string,
        @Body('name') name:string,
        @Body('url') url:string,
        @Body('description') description:string,
        @Body('typeDocId') typeDocId:string
    ){
        try{
            return await this.userService.addTeamDocument(userId,name,url,description,typeDocId);
        }catch(err){
            Logger.error(err,'UserController/addTeamDocument')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
        
    }
    @Get('getTeamDocuments')
    async getDocuments(@GetCurrentUserId() userId:string){
        try{
            return await this.userService.getTeamDocuments(userId);
        }catch(err){
            Logger.error(err,'UserController/getTeamDocuments')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }
    @Post('deleteTeamDocs')
    async deleteTeamDocs(
        @GetCurrentUserId() userId:string,
        @Body('docsIds') docsIds:string[]
        ){
            try{
                return await this.userService.deleteTeamDocs(userId,docsIds);
            }catch(err){
                Logger.error(err,'UserController/deleteTeamDocs')
                throw new HttpException(err,HttpStatus.BAD_REQUEST);
            }
        }
    @Post('commitDocs')
    async commitDocs(@GetCurrentUserId() userId:string,@Body('title') title:string,@Body('description') description:string,@Body('docsIds')docsIds:string[]){
        try{
            return await this.userService.commitDocs(userId,title,description,docsIds);
        }catch(err){
            Logger.error(err,'UserController/commitDocs')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }

    }

    @Get('getTeamsTeacherResponsibleFor')
    async getTeamsTeacherResponsibleFor(@GetCurrentUserId() userId:string){
        try{
            return await this.userService.getTeamsTeacherResponsibleFor(userId)
        }catch(err){
            Logger.error(err,'UserController/getTeamsTeacherResponsibleFor')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }
    @Get('getTeamsTeacherResponsibleForWithMembers/:promotionId')
    async getTeamsTeacherResponsibleForWithMembers(@GetCurrentUserId() userId:string,@Param('promotionId') promotionId:string){
        try{
          
            return await this.userService.getTeamsTeacherResponsibleForWithMembers(userId,promotionId)
        }catch(err){
            Logger.error(err,'UserController/getTeamsTeacherResponsibleFor')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }
    
    @Get('getAllDocsAdmin/:promotionId/:teamId')
    async getAllDocsAdmin(@GetCurrentUserId() userId:string,@Param('promotionId')promotionId:string,@Param('teamId')teamId:string){
        try{
            return await this.userService.getAllDocsAdmin(userId,promotionId,teamId)
        }catch(err){
            Logger.error(err,'UserController/getAllDocsAdmin')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }


    @Post('createSoutenance')
    async createSoutenance(@GetCurrentUserId() userId:string,@Body() data:SoutenanceDto){
        try{
            return await this.userService.createSoutenance(userId,data)
        }catch(err){
            Logger.error(err,'UserController/createSoutenance')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }

    @Get('getSoutenances/:promotionId')
    async getSoutenances(@GetCurrentUserId() userId:string,@Param('promotionId') promotionId:string){
        try{
            return await this.userService.getSoutenances(promotionId)
        }catch(err){
            Logger.error(err,'UserController/getSoutenances')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }
    @Get('getSoutenance/:soutenanceId')
    async getSoutenance(@GetCurrentUserId() userId:string,@Param('soutenanceId') soutenanceId:string){
        try{
            return await this.userService.getSoutenance(soutenanceId)
        }catch(err){
            Logger.error(err,'UserController/getSoutenances')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }

    @Get('getTeamCommits/:teamId')
    async getTeamCommits(@GetCurrentUserId() userId:string,@Param('teamId') teamId:string){
        try{
            return await this.userService.getTeamCommits(userId,teamId)
        }catch(err){
            Logger.error(err,'UserController/getTeamsTeacherResponsibleFor')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }

    @Get('getAllCommitsDocs/:teamId')
    async getAllCommitsDocs(@GetCurrentUserId() userId:string,@Param('teamId') teamId:string){
        try{
           
            console.log('sssssssssssssssssssssss')
            return await this.userService.getAllCommitsDocs(userId,teamId)
        }catch(err){
            Logger.error(err,'UserController/getAllCommitsDocs')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }

    @Post('validatedDocument')
    async validatedDocument(@GetCurrentUserId() userId:string,@Body('documentIds') documentIds:string[]){
        try{
          
            return await this.userService.validatedDocument(userId,documentIds)
        }catch(err){
            Logger.error(err,'UserController/validatedDocument')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }

    //crud operations student
    @Public()
    @Get('getStudents')
    async getStudents(){
        try{
            return await this.userService.getStudents()
        }catch(err){
            Logger.error(err,'UserController/getStudents')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }

    }
    @Post('deleteStudent')
    async deleteStudent(@Body('studentId') studentId:string ){
        try{
            return await this.userService.deleteStudent(studentId)
        }catch(err){
            Logger.error(err,'UserController/addStudent')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }
    @Put('editStudent')
    async editStudent(){

    }

     //crud operations student
     @Public()
     @Get('getTeachers')
     async getTeachers(){
         try{
             return await this.userService.getTeachers()
         }catch(err){
             Logger.error(err,'UserController/getTeachers')
             throw new HttpException(err,HttpStatus.BAD_REQUEST);
         }
 
     }
     @Post('deleteTeacher')
     async deleteTeacher(@Body('teacherId') teacherId:string ){
         try{
             return await this.userService.deleteTeacher(teacherId)
         }catch(err){
             Logger.error(err,'UserController/deleteTeacher')
             throw new HttpException(err,HttpStatus.BAD_REQUEST);
         }
     }
     @Put('editTeacher')
     async editTeacher(){
 
     }

    //theme suggestions crud operations
    @Post('/createThemeSuggestion')
    async createThemeSuggestion(@GetCurrentUserId() userId:string,
                                @Body('title') title:string,
                                @Body('description') description:string,
                                @Body('documents') documents:ThemeDocDto[],
                                @Body('promotionId') promotionId:string
                                ){        
                                    Logger.error(documents,"*****555****")
        try{
            return await this.userService.createThemeSuggestion(userId,title,description,documents,promotionId);
        }catch(err){
            Logger.error(err,'UsrController/createThemeSuggestion')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }

    @Public()
    @Get('getThemeSuggestions/:promotionId')
    async getThemeSuggestions(@Param('promotionId') promotionId:string){
        try{
            return await this.userService.getThemeSuggestions(promotionId)
        }catch(err){
            Logger.error(err,'UsrController/getThemeSuggestions')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }

    @Public()
    @Get('getThemeSuggestions')
    async getAllThemeSuggestions(){
        try{
            return await this.userService.getAllThemeSuggestions()
        }catch(err){
            Logger.error(err,'UsrController/getAllThemeSuggestions')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }

    @Public()
    @Get('getThemeSuggestion/:themeId')
    async getThemeSuggestion(@Param('themeId') themeId:string){
        try{
            return await this.userService.getThemeSuggestion(themeId)
        }catch(err){
            Logger.error(err,'UsrController/getThemeSuggestion')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }

    @Post('validateThemeSuggestion')
    async validateThemeSuggestion(@GetCurrentUserId() userId:string,@Body('themeId') themeId:string){
        try{
            return await this.userService.validateThemeSuggestion(userId,themeId)
        }catch(err){
            Logger.error(err,'UsrController/validateThemeSuggestion')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }

    }
    //themes
    @Public()
    @Get('getThemes')
    async getAllThemes(){
        try{
            return await this.userService.getAllThemes()
        }catch(err){
            Logger.error(err,'UsrController/getAllThemes')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }

    @Public()
    @Get('getThemes/:promotionId')
    async getThemes(@Param('promotionId') promotionId:string){
        try{
            return await this.userService.getThemes(promotionId)
        }catch(err){
            Logger.error(err,'UsrController/getThemes')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }
    @Public()
    @Get('getTheme/:themeId')
    async getTheme(@Param('themeId') themeId:string){
        try{
            return await this.userService.getTheme(themeId)
        }catch(err){
            Logger.error(err,'UsrController/getTheme')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }

   


    @Public()
    @Get('getAllTeams/:promotionId')
    async getTeams(@Param('promotionId') promotionId:string){
        try{
            return await this.userService.getTeams(promotionId)
        }catch(err){
            Logger.error(err,"UserController/getTeams")
            throw new HttpException(err,HttpStatus.BAD_REQUEST)
        }
    }

    @Public()
    @Get('getTeamsWithThemes/:promotionId')
    async getTeamsithThemes(@Param('promotionId') promotionId:string){
        return await this.userService.getTeamsithThemes(promotionId)
    }

    @Public()
    @Get('getTeams/:teamId')
    async getTeam(@Param('teamId') teamId:string){
        try{
            return await this.userService.getTeam(teamId)
        }catch(err){
            Logger.error(err,"UserController/getTeam")
            throw new HttpException(err,HttpStatus.BAD_REQUEST)
        }
    }
    @Get('getUserInfo')
    async getUser(@GetCurrentUserId() userId:string){
        return await this.userService.getUserInfo(userId)
    }

    @Get('getTeamMessages')
    async getTeamMessages(@GetCurrentUserId() userId:string){
        return await this.userService.getTeamMessages(userId)
    }

    @Post('submitWishList')
    async submitWishList(@GetCurrentUserId() userId:string,@Body() data:WishListDTO){
        try{
            return await this.userService.submitWishList(userId,data)
        }catch(err){
            Logger.error(err,'UserController/submitWishList')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }

    @Public()
    @Get('getAllPromotions')
    async getAllPromotions(){
          try{
            return await this.userService.getAllPromotions()
        }catch(err){
            Logger.error(err,'UserController/getAllPromotions')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
       
    }
   
    @Post('asignThemesToTeams')
    async asignThemesToTeams(@GetCurrentUserId() userId:string,@Body('promotionId') promotionId:string,@Body('method') method:string){
        try{
            return await this.userService.asignThemesToTeams(userId,promotionId,method)
        }catch(err){
            Logger.error(err,'UserController/asignThemesToTeams')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }
    
    @Post('applyThemesToTeamsAssignements')
    async applyThemesToTeamsAssignements(userId:string,@Body()data:ThemeToTeamDTO){
        try{
            return await this.userService.applyThemesToTeamsAssignements(userId,data)
        }catch(err){
            Logger.error(err,'UserController/applyThemesToTeamsAssignements')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }

    }

    @Post('encadrerTheme')
    async encadrerTheme(@GetCurrentUserId() userId:string,@Body('themeId') themeId:string,@Body('teacherId')teacherId:string){
        try{
            return await this.userService.encadrerTheme(userId,themeId,teacherId)
        }catch(err){
            Logger.error(err,'UserController/encadrerTheme')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }

    }

    @Post('assignTeamsToTeacher')
    async assignTeamsToTeacher(@GetCurrentUserId() userId:string,@Body('teamIds') teamIds:string[],@Body('teacherId') teacherId:string){
            try{
                return await this.userService.assignTeamsToTeacher(userId,teamIds,teacherId)
            }catch(err){
                Logger.error(err,'UserController/assignTeamsToTeacher')
                throw new HttpException(err,HttpStatus.BAD_REQUEST);
            }
    }
    @Get('getPromotionDocumentTypes')
    async getPromotionDocumentTypes(@GetCurrentUserId() userId){
        try{
            return await this.userService.getPromotionDocumentTypes(userId)
        }catch(err){
            Logger.error(err,'UserController/getPromotionDocumentTypes')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }

    @Public()
    @Get('getSalles')
    async getSalles(){
        return await this.userService.getSalles()
    }

    @Post('canSoutenir')
    async canSoutenir(@GetCurrentUserId() userId:string,@Body('teamId') teamId:string){
        try{
            return await this.userService.canSoutenir(userId,teamId);
        }catch(err){
            Logger.error(err,'UserController/sendNotifications')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }
    //test routes---------------------------
    @Public()
    @Post('test/sendNotification')
    async sendNotification(@Body('userId') userId:string, @Body('description') description:string){
        try{
            return await this.userService._sendNotfication(userId,description);
        }catch(err){
            Logger.error(err,'UserController/sendNotifications')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
 
    }

  

    @Public()
    @Post('test/createNewConfig')
    async createNewConfig(
            @Body('key') key:string,
            @Body('value') value:string
            ){
        try{
            console.log(key,value)
            return await this.userService.createNewConfig(key,value)
        }catch(err){
            Logger.error(err,'UserController/createNewConfig')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }

    @Public()
    @Post('test/createNewPromotion')
    async createNewPromotion(@Body('name') name:string,@Body('documentTypes') documentTypes:string[]) {
    try{
        return await this.userService.createNewPromotion(name,documentTypes)
    }catch(err){
        Logger.error(err,'UserController/createNewPromotion')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);
    }
}

@Public()
@Post('test/createSalle')
async createSalle(@Body('name') name:string) {
try{
    return await this.userService.careateSalle(name)
}catch(err){
    Logger.error(err,'UserController/createNewPromotion')
    throw new HttpException(err,HttpStatus.BAD_REQUEST);
}
}
}