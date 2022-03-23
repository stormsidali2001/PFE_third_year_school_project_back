import { Body, Controller, Get, Post } from "@nestjs/common";
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
  
  
}