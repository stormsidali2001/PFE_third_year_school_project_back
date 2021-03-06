import { Body, Controller, Get, HttpException, HttpStatus, Logger, Param, Post, Req, Request, UseGuards } from "@nestjs/common";
import { GetCurrentUser } from "src/common/decorators/get-current-user";
import { GetCurrentUserId } from "src/common/decorators/get-current-user-id.decorator";
import { Public } from "src/common/decorators/public.decorator";
import { AuthenticatedGuard } from "src/common/guards/authentificatedGuard";
import { LocalAuthGuard } from "src/common/guards/local-auth.guard";
import { RefrechTokenGuard } from "src/common/guards/refrech-token-guard";
import { AdminDto, EnterpriseDTO, StudentDTO, StudentTestDTO, TeacherDTO, TeacherTestDTO, UserDTO } from "../core/dtos/user.dto";
import { AuthService } from "./auth.service";

@Controller()
export class AuthController{
    constructor(private authService:AuthService){}
   @Public()
   @UseGuards(LocalAuthGuard)
   @Post('signin')
    
   async signin(@Request() req){
        return req.user;
   }
   @Public()
   @Post('signup/teacher')
   async signupTeacher(@GetCurrentUserId() userId:string,@Body() data:TeacherDTO){
     
       return this.authService.signupTeacher(userId,data);
   }

   @Public()
   @Post('signup/teachers')
   async signupTeachers(@GetCurrentUserId() userId:string,@Body() data:TeacherDTO[]){
       return await this.authService.signupTeachers(userId,data)
   }

   @Public()
   @Post('signup/student')
   async signupStudent(@GetCurrentUserId() userId:string,@Body() data:StudentDTO){
    
       return await this.authService.signupStudent(userId,data);
   }

   @Public()
   @Post('signup/students')
   async signupStudents(@GetCurrentUserId() userId:string,@Body() data:StudentDTO[]){
    
       return await this.authService.signupStudents(userId,data);
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
    



    
    @Post('logout')
    async logout(@Request() request){
         request.logOut();
        request.session.cookie.maxAge = 0;

        return "logedout!!"
    }

    @Public()
    @Post("signupAdmin/afsjsfajgdlgdjdsgljlgjdjgdajsgj;lgdssgd")
    async signupAdmin(@Body() admin:AdminDto){
        return this.authService.signupAdmin(admin);
    }
    // test
    
  
    @Public()
    @Post('signup/studentTest')
    async signupStudentTest(@Body() data:StudentTestDTO){
     
        return await this.authService.signupStudentTest(data);
    }

    
    @Public()
    @Post('signup/signupTeacherTest')
    async signupTeacherTest(@Body() data:TeacherTestDTO){
     
        return await this.authService.signupTeacherTest(data);
    }

     
}