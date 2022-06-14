import { Body, Controller, Get, HttpException, HttpStatus, Logger, Param, ParseBoolPipe, Post } from "@nestjs/common";
import { GetCurrentUserId } from "src/common/decorators/get-current-user-id.decorator";
import { TeamInvitationService } from "../services/team.invitation.service";


/**
 *    6 routes
 */
@Controller()
export class TeamInvitationController{
    constructor(private readonly teamInvitationService:TeamInvitationService) {}

    @Post('/sendATeamInvitation')
    async sendATeamInvitation(
        @GetCurrentUserId() userId:string,
        @Body('recieverId') recieverId:string,
        @Body('description') description:string
    ){
      

        return await this.teamInvitationService.sendATeamInvitation(userId,recieverId,description);
    }

    @Post('/acceptRefuseTeamInvitation')
    async acceptRefuseTeamInvitation(
        @Body('invitationId') invitationId:string ,
        @Body('accepted',ParseBoolPipe) accepted:boolean,
        @GetCurrentUserId() userId:string 
        
    ){
      
        return this.teamInvitationService.acceptRefuseTeamInvitation(invitationId,userId,accepted);
    }

    @Post('/sendTeamJoinRequest')
    async sendTeamJoinRequest(
            @Body('senderId') senderId:string,
            @Body('teamId') teamId:string,
            @Body('description') description:string
        ){
         return this.teamInvitationService.sendTeamJoinRequest(senderId,teamId,description)
    }
    @Get('getStudentsWithoutTeam')
    async getStudentsWithoutTeam(@GetCurrentUserId() userId:string){
        try{
            return await this.teamInvitationService.getStudentsWithoutTeam(userId)
        }catch(err){
            Logger.error(err,'UserController/getStudentsWithoutTeam')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }

    @Get('getInvitationList')
    async getInvitationList(@GetCurrentUserId() userId:string){
        try{
            return await  this.teamInvitationService.getInvitationList(userId);
        }catch(err){
            Logger.error(err,'UserController/getInvitationList')
        }
    }

    //test routes---------------------------------------------------------------------------------
    @Get('/invitations/:studentId')
    async getInvitations(
        @Param('studentId') studentId:string
        ){
        try{

            return await this.teamInvitationService.getInvitations(studentId);
        }catch(err){
            Logger.error(err,'UsrController/getInvitations')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }

    }
   
   
}