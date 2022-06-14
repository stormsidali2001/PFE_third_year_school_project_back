import { Body, Controller, Get, HttpException, HttpStatus, Logger, Param, Post } from "@nestjs/common";
import { GetCurrentUserId } from "src/common/decorators/get-current-user-id.decorator";
import { SurveyDto } from "src/core/dtos/user.dto";
import { TeamSurveyService } from "../services/team.survey.service";

/*

    5 routes
*/

@Controller()
export class TeamSurveyController{
    constructor(private readonly teamSurveyService:TeamSurveyService) {}
    @Post('createSurvey')
    async createSurvey(@GetCurrentUserId() userId:string,@Body('survey') survey:SurveyDto){
       
        try{
            return await this.teamSurveyService.createSurvey(userId,survey);
        }catch(err){
            Logger.error(err,'UsrController/createSurvey')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }

    }
    @Get('surveys')
    async getSurveys(@GetCurrentUserId() userId:string){
            try{
                return await this.teamSurveyService.getSurveys(userId);
            }catch(err){
                Logger.error(err,"TeamSurveyController/getSurveys");
                throw new HttpException(err,HttpStatus.BAD_REQUEST)
            }
    }
    @Get('surveys/:surveyId')
    async getSurvey(@GetCurrentUserId() userId:string,@Param('surveyId') surveyId:string){
            try{
                return await this.teamSurveyService.getSurvey(userId,surveyId);
            }catch(err){
                Logger.error(err,"TeamSurveyController/getSurveys");
                throw new HttpException(err,HttpStatus.BAD_REQUEST)
            }
    }

    @Post('submitSurveyAnswer')
    async submitSurveyAnswer( @GetCurrentUserId() userId:string,
                                @Body('surveyId') surveyId:string,
                                @Body('optionId') optionId:string,
                                @Body('argument') argument:string
                                ){
        try{
            return await this.teamSurveyService.submitSurveyAnswer(userId,surveyId,optionId,argument);
        }catch(err){
            Logger.error(err,'TeamSurveyController/submitSurveyAnswer')
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
            return await this.teamSurveyService.getSurveyParticipantsArguments(userId,surveyId,optionId);
        }catch(err){
            Logger.error(err,'UsrController/createSurvey')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }
}