import { Body, Controller, Get, HttpException, HttpStatus, Logger, Param, Post } from "@nestjs/common";
import { GetCurrentUserId } from "src/common/decorators/get-current-user-id.decorator";
import { TeamSurveyService } from "../services/team.survey.service";



@Controller()
export class TeamSurveyController{
    constructor(private readonly teamSurveyService:TeamSurveyService) {}

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