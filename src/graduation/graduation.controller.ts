import { Body, Controller, Get, HttpException, HttpStatus, Logger, Param, Post } from "@nestjs/common";
import { GetCurrentUserId } from "src/common/decorators/get-current-user-id.decorator";
import { SoutenanceDto } from "src/core/dtos/user.dto";
import { GraduationService } from "./graduation.service";



@Controller()
export class GraduationController{
    constructor(
        private readonly graduationService:GraduationService
    ){}
    @Post('createSoutenance')
    async createSoutenance(@GetCurrentUserId() userId:string,@Body() data:SoutenanceDto){
        try{
            return await this.graduationService.createSoutenance(userId,data)
        }catch(err){
            Logger.error(err,'UserController/createSoutenance')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }

    @Get('getSoutenances/:promotionId')
    async getSoutenances(@GetCurrentUserId() userId:string,@Param('promotionId') promotionId:string){
        try{
            return await this.graduationService.getSoutenances(promotionId)
        }catch(err){
            Logger.error(err,'UserController/getSoutenances')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }
    @Get('getSoutenance/:soutenanceId')
    async getSoutenance(@GetCurrentUserId() userId:string,@Param('soutenanceId') soutenanceId:string){
        try{
            return await this.graduationService.getSoutenance(soutenanceId)
        }catch(err){
            Logger.error(err,'UserController/getSoutenances')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }

}