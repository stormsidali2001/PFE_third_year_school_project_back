import { Body, Controller, Get, Logger, Param, Post } from "@nestjs/common";
import { Public } from "src/common/decorators/public.decorator";
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
       return this.authService.signupStudent(data);
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
     
}