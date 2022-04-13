import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "src/core/repositories/user.repository";
import { EnterpriseDTO, StudentDTO, TeacherDTO, UserDTO, UserRO } from "../core/dtos/user.dto";
import {  UserEntity, UserType } from "../core/entities/user.entity";
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { StudentRepository } from "src/core/repositories/student.repository";
import { StudentEntity } from "src/core/entities/student.entity";
import { RestPasswordTokenRepository } from "src/core/repositories/reset.password.token.repository";
import {randomBytes} from "crypto";
import { RestPasswordTokenEntity } from "src/core/entities/resetPasswordToken.entity";
import * as nodemailer from 'nodemailer';
import { JwtService } from "@nestjs/jwt";
import { jwtPayload } from "./types/jwtPayload.type";
import { Tokens } from "./types/tokens";
import { getManager } from "typeorm";
import * as argon from 'argon2'



@Injectable()
export class AuthService{
    constructor( 
        private userRepository:UserRepository,
        private studentRepository:StudentRepository,
        private resetPasswordTokenRepository:RestPasswordTokenRepository,
        private jwtService:JwtService
        ){}
    async signin(data:UserDTO){
        const manager = getManager();
        const {email,password} = data;
        const user = await this.userRepository.findOne({where:{email}})
        if(!user){
            throw new HttpException('Email does not exists',HttpStatus.BAD_REQUEST);
        }
        const equal:boolean = await bcrypt.compare(password,user.password);
        if(!equal){
            throw new HttpException('Wrong Password',HttpStatus.BAD_REQUEST);
        }
        await this.userRepository.save(user);
      
          const tokens:Tokens = await this._getTokens(user.id,user.email);
          await this._updateRefrechTokenHash(user.id,tokens.refrechToken)
          if(user.userType === UserType.STUDENT){
            const studentRepository = manager.getRepository(StudentEntity);
            const student = await studentRepository.createQueryBuilder('student')
            .where('student.userId = :userId',{userId:user.id}).getOne()
            return {...tokens,userType:user.userType,uuid:user.id,email:user.email,firstName:student.firstName,lastName:student.lastName,dob:student.dob,code:student.code,studentId:student.id};
          }
         

        
    }
   
    async signupStudent(data:StudentDTO):Promise<Tokens>{
        try{

        
        const {email,password,firstName,lastName,dob,code} = data;
        let user:UserEntity = await this.userRepository.findOne({where:{email}})
        const name = email?.split('@')[0]?.split('.')[0];
        const lastNameEmail =  email?.split('@')[0]?.split('.')[1]
        const service = email?.split('@')[1]?.split('.')[0];
        const domain = email?.split('@')[1]?.split('.')[1];
        
        if(name?.length > 0 && lastNameEmail?.length>0 && service!== 'esi-sba' && domain !='dz'){
            throw new HttpException("le mail doit etre un mail scholaire!",HttpStatus.BAD_REQUEST);
        }
        if(user){
            throw new HttpException('Email already exists',HttpStatus.BAD_REQUEST);
        }
        // regex to check if a password contain at least a special character,at least a capital letter,at least a number and at least 8 characters
        const regex =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if(password.match(regex)==null){
            throw new HttpException('Password must contain at least a special character,at least a capital letter,at least a number and at least 8 characters',HttpStatus.BAD_REQUEST); 
        }
     
        user =  this.userRepository.create({email,password,userType:UserType.STUDENT});
        user.password = await bcrypt.hash(user.password,10);
        const student:StudentEntity = this.studentRepository.create({firstName,lastName,dob,code});
        student.user = user;
        user = await this.userRepository.save(user);
        await this.studentRepository.save(student);

        const tokens:Tokens = await this._getTokens(user.id,user.email);
        await this._updateRefrechTokenHash(user.id,tokens.refrechToken)

            return tokens;
        }catch(err){
            Logger.error(err,"AuthService/signupStudent")
            throw new HttpException(err,HttpStatus.BAD_REQUEST)
        }
    }
    async signupTeacher(data:TeacherDTO){
        
    }
    async signupEnterprise(data:EnterpriseDTO){

    }

    async forgotPassword(email:string){
        
       
        const user:UserEntity = await this.userRepository.findOne({where:{email}});
        const service = email.split('@')[1].split('.')[0];
        const domain = email.split('@')[1].split('.')[1];
        
        if(service!== 'esi-sba' && domain !='dz'){
            throw new HttpException("le mail doit etre un mail scholaire!",HttpStatus.BAD_REQUEST);
        }
        if(!user){
             throw new HttpException("email does not exist",HttpStatus.BAD_REQUEST);
            // return 'email does not exist';
        }
        const userTokenInDb:RestPasswordTokenEntity = await this.resetPasswordTokenRepository.createQueryBuilder('tokens').where('tokens.userId = :userId',{userId:user.id}).getOne();

        if(userTokenInDb){
            this.resetPasswordTokenRepository.delete(userTokenInDb.id);
        }
        var token:string =await new Promise((resolve,reject)=>{
            randomBytes(32,(err,buf)=>{
                if(err) reject(err);
                resolve(buf.toString('hex'))
            })
        }) 
        
       
        const expiresIn = 15*60*1000;// in ms
        const resetPasswordToken = this.resetPasswordTokenRepository.create({user,expiresIn,token:token});
      

        await this.resetPasswordTokenRepository.save(resetPasswordToken);
       
        //sending an email
        let transporter = nodemailer.createTransport({
            service:'Gmail',
            auth: {
              user: "assoulsidali@gmail.com", // generated ethereal user
              pass: "mydreamismylife@", // generated ethereal password
            },
          });

          let info = await transporter.sendMail({
            from: '"It experts👻" <assoulsidali@gmail.com>', // sender address
            to: email, // list of receivers separated by ,
            subject: "Hello ✔", // Subject line
            html: `<b>vous avez envoyer une demmande de reincialisation de mot de passe presser sur le lien si il s'agit bien de vous </b><br/> le lien:  http://localhost:3000/resetpassword/${token}?uid=${user.id}`, // html body
          });
        
          console.log("Message sent: %s", info.messageId);
          // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        
          // Preview only available when sending through an Ethereal account
          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
          // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
          return "check you email please";
    }
    
    async resetPassword(password:string,token:string,userId:string){
          // regex to check if a password contain at least a special character,at least a capital letter,at least a number and at least 8 characters
          const regex =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
          if(password.match(regex)==null){
              throw new HttpException('mot de passe tres faible',HttpStatus.BAD_REQUEST); 
          }
        const resetPasswordToken:RestPasswordTokenEntity = await this.resetPasswordTokenRepository.createQueryBuilder('tokens').where('tokens.userId = :userId',{userId}).getOne();
       
        Logger.log(`tokenDb:${resetPasswordToken}`,"restPassword")
        if(!resetPasswordToken){
            throw new HttpException("bad url",HttpStatus.FORBIDDEN);
        }
        if(resetPasswordToken.token!= token){
            throw new HttpException("wrong token",HttpStatus.FORBIDDEN);
        
        }
       
        if(Date.now() >= resetPasswordToken.createdAt.getTime()+resetPasswordToken.expiresIn ){

            await this.resetPasswordTokenRepository.delete(resetPasswordToken.id);
            throw new HttpException("token expired!!",HttpStatus.BAD_REQUEST);
            // return "token expired createdAt:"+resetPasswordToken.createdAt.getTime()+" resetPasswordToken.expiresIn: "+resetPasswordToken.expiresIn+" date now:"+Date.now();
        }
        const user = await this.userRepository.findOne(userId);
        user.password = await bcrypt.hash(password,10);
        await this.userRepository.save(user);
        await this.resetPasswordTokenRepository.delete(resetPasswordToken.id);
        return `${user.email} password has been reset succesfully`;
    }

    async refrechToken(userId:string,refrechToken:string):Promise<Tokens>{
        try{
            const manager = getManager();
            const userRepository = manager.getRepository(UserEntity);
            const user = await userRepository.findOne({id:userId});
            if(!user || !user.refrechTokenHash){
                Logger.error("acces denied:user not found or user does not have a refresh token","AuthService/refrechToken")
                throw new HttpException("acces denied",HttpStatus.FORBIDDEN)
            }
            const matches:boolean = await argon.verify(user.refrechTokenHash,refrechToken)
            if(!matches){
                Logger.error("acces denied: wrong refrech token","AuthService/refrechToken")
                throw new HttpException("acces denied",HttpStatus.FORBIDDEN)
            }
            const tokens:Tokens = await this._getTokens(user.id,user.email);
            await this._updateRefrechTokenHash(user.id,tokens.refrechToken)
    
                return tokens;

        }catch(err){
            Logger.error(err,"AuthService/refrechToken")
            throw new HttpException(err,HttpStatus.BAD_REQUEST)
        }
    }
  async logout(userId:string){
    try{
        const manager = getManager();
        const userRepository = manager.getRepository(UserEntity);
        const user = await userRepository.findOne({id:userId});
        if(!user){
            Logger.error("acces denied:user not found ","AuthService/logout")
            throw new HttpException("acces denied",HttpStatus.FORBIDDEN)
        }
        await userRepository.update({id:userId},{refrechTokenHash:null})
        return "logout success";
    }catch(err){
        Logger.error(err,"AuthService/logout")
        throw new HttpException(err,HttpStatus.BAD_REQUEST)
    }
}
    //utility functions---------------------------
    async _getTokens(userId:string,email:string):Promise<Tokens>{
        const jwtPayload:jwtPayload = {
            uuid:userId,
            email
        }
        const [accesToken,refrechToken] = await Promise.all([
            this.jwtService.signAsync(jwtPayload,{
                secret:process.env.ACCESS_TOKEN_SECRET,
                expiresIn:'15m'
            }),
            this.jwtService.signAsync(jwtPayload,{
                secret:process.env.REFRECH_TOKEN_SECRET,
                expiresIn:'7d'
            })
        ])

        return {
            accesToken,
            refrechToken
        }
    }

    async _updateRefrechTokenHash(userId:string,refrechToken:string){
        try{
            const manager = getManager();
            const userRepository =  manager.getRepository(UserEntity);
            const refrechTokenHash = await argon.hash(refrechToken)
            await userRepository.update({id:userId},{refrechTokenHash})

        }catch(err){
            Logger.error(err,"AuthService/_updateRefrechTokenHash")
            throw new HttpException(err,HttpStatus.BAD_REQUEST)
        }
        
    }

}