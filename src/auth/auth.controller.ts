import { Body, Controller, Get, HttpException, HttpStatus, Logger, Param, Post, UseGuards } from "@nestjs/common";
import { GetCurrentUser } from "src/common/decorators/get-current-user";
import { GetCurrentUserId } from "src/common/decorators/get-current-user-id.decorator";
import { Public } from "src/common/decorators/public.decorator";
import { RefrechTokenGuard } from "src/common/guards/refrech-token-guard";
import { EnterpriseDTO, StudentDTO, TeacherDTO, UserDTO } from "../core/dtos/user.dto";
import { AuthService } from "./auth.service";

@Controller()
export class AuthController{
    constructor(private authService:AuthService){}
   @Public()
   @Post('signin')
   async signin(@Body() data:UserDTO){
       return this.authService.signin(data);
   }
   @Public()
   @Post('signup/teacher')
   async signupTeacher(@Body() data:TeacherDTO){
     
       return this.authService.signupTeacher(data);
   }
   @Public()
   @Post('signup/student')
   async signupStudent(@Body() data:StudentDTO){
    
       return await this.authService.signupStudent(data);
   }
   @Public()
   @Post('signup/entreprise')
   async signupEntereprise(@Body() data:EnterpriseDTO){
       return this.authService.signupEnterprise(data);
   }
   @Public()
   @Post('forgotpassword')
   async forgotpassword(@Body('email') email:string){
        Logger.log(`${email} sffklfsk`)
    
        return this.authService.forgotPassword(email);
    }
    @Public()
    @Post('resetpassword')
    async resetPassword(@Body('password') password:string,
                        @Body('token') token:string,
                        @Body('userId') userId:string){
        return this.authService.resetPassword(password,token,userId);
     }
     @Public()
     @UseGuards(RefrechTokenGuard)
    @Get('refrechtoken')
    async refrechToken(@GetCurrentUserId() userId:string,@GetCurrentUser('refrechToken') refrechtoken:string){
        try{

            return await this.authService.refrechToken(userId,refrechtoken);
        } catch(error){
            Logger.error(error.message,"AuthController/refrechToken");
            throw new HttpException(error.message,HttpStatus.BAD_REQUEST);
        }
    }

    @Post('logout')
    async logout(@GetCurrentUserId() userId:string){
        try{
            return await this.authService.logout(userId);
        }catch(error){
            Logger.error(error.message,"AuthController/logout");
            throw new HttpException(error.message,HttpStatus.BAD_REQUEST);
        }
    }
     
}