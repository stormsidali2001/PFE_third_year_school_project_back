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
    
  

 
 
     
    
    @Get('notifications/:number')
    async getLastNotifications(@GetCurrentUserId() userId:string,   @Param('number',ParseIntPipe) number:number){
        try{
            return await this.userService.getLastNotifications(userId,number);
        }catch(err){
            Logger.error(err,'UserController/getNotifications')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
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