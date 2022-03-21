import { Body, Controller, Get, Logger, Param, Post } from "@nestjs/common";
import { EnterpriseDTO, StudentDTO, TeacherDTO, UserDTO } from "../core/dtos/user.dto";
import { AuthService } from "./auth.service";

@Controller()
export class AuthController{
    constructor(private authService:AuthService){}
 
   @Post('signin')
   async signin(@Body() data:UserDTO){
       return this.authService.signin(data);
   }

   @Post('signup/teacher')
   async signupTeacher(@Body() data:TeacherDTO){
       return this.authService.signupTeacher(data);
   }
   @Post('signup/student')
   async signupStudent(@Body() data:StudentDTO){
       return this.authService.signupStudent(data);
   }
   @Post('signup/entreprise')
   async signupEntereprise(@Body() data:EnterpriseDTO){
       return this.authService.signupEnterprise(data);
   }

   @Post('forgotpassword')
   async forgotpassword(@Body('email') email:string){
        Logger.log(`${email} sffklfsk`)
    
        return this.authService.forgotPassword(email);
    }
    @Post('resetpassword/:token/:uid')
    async resetPassword(@Body() password:string,
                        @Param('token') token:string,
                        @Param('userId') userId:string){
        return this.authService.resetPassword(password,token,userId);
     }
}