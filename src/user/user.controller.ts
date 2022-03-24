import { Body, Controller, Get, HttpException, HttpStatus, Logger, Param, ParseBoolPipe, Post } from "@nestjs/common";

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

  
  
}