import { Body, Controller, Get, HttpException, HttpStatus, Logger, Param, Post } from "@nestjs/common";
import { GetCurrentUserId } from "src/common/decorators/get-current-user-id.decorator";
import { Public } from "src/common/decorators/public.decorator";
import { ThemeDocDto } from "src/core/dtos/user.dto";
import { ThemeService } from "../services/theme.service";

/**
 * /createThemeSuggestion
 * getThemeSuggestions
 * getThemeSuggestions/:promotionId
 * getThemeSuggestions
 * getThemeSuggestion/:themeId
 * 
 * validateThemeSuggestion
 * 
 * getThemes
 * getThemes/:promotionId
 * getTheme/:themeId
 * 
 */

@Controller()
export class ThemeController{
    constructor(
        private readonly themeService:ThemeService
    ){}
    //theme suggestions
    @Post('/createThemeSuggestion')
    async createThemeSuggestion(@GetCurrentUserId() userId:string,
                                @Body('title') title:string,
                                @Body('description') description:string,
                                @Body('documents') documents:ThemeDocDto[],
                                @Body('promotionId') promotionId:string
                                ){        
                                    Logger.error(documents,"*****555****")
        try{
            return await this.themeService.createThemeSuggestion(userId,title,description,documents,promotionId);
        }catch(err){
            Logger.error(err,'UsrController/createThemeSuggestion')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }

    @Public()
    @Get('getThemeSuggestions/:promotionId')
    async getThemeSuggestions(@Param('promotionId') promotionId:string){
        try{
            return await this.themeService.getThemeSuggestions(promotionId)
        }catch(err){
            Logger.error(err,'UsrController/getThemeSuggestions')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }

    @Public()
    @Get('getThemeSuggestions')
    async getAllThemeSuggestions(){
        try{
            return await this.themeService.getAllThemeSuggestions()
        }catch(err){
            Logger.error(err,'UsrController/getAllThemeSuggestions')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }

    @Public()
    @Get('getThemeSuggestion/:themeId')
    async getThemeSuggestion(@Param('themeId') themeId:string){
        try{
            return await this.themeService.getThemeSuggestion(themeId)
        }catch(err){
            Logger.error(err,'UsrController/getThemeSuggestion')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }

    @Post('validateThemeSuggestion')
    async validateThemeSuggestion(@GetCurrentUserId() userId:string,@Body('themeId') themeId:string){
        try{
            return await this.themeService.validateThemeSuggestion(userId,themeId)
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
            return await this.themeService.getAllThemes()
        }catch(err){
            Logger.error(err,'UsrController/getAllThemes')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }

    @Public()
    @Get('getThemes/:promotionId')
    async getThemes(@Param('promotionId') promotionId:string){
        try{
            return await this.themeService.getThemes(promotionId)
        }catch(err){
            Logger.error(err,'UsrController/getThemes')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }
    @Public()
    @Get('getTheme/:themeId')
    async getTheme(@Param('themeId') themeId:string){
        try{
            return await this.themeService.getTheme(themeId)
        }catch(err){
            Logger.error(err,'UsrController/getTheme')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }
}