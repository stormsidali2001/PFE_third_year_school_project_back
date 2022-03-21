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


@Injectable()
export class AuthService{
    constructor( 
        private userRepository:UserRepository,
        private studentRepository:StudentRepository,
        private resetPasswordTokenRepository:RestPasswordTokenRepository
        ){}
    async signin(data:UserDTO):Promise<UserRO>{
        const {email,password} = data;
        const user = await this.userRepository.findOne({where:{email}})
        if(!user){
            throw new HttpException('Email does not exists',HttpStatus.BAD_REQUEST);
        }
        const equal:boolean = await bcrypt.compare(password,user.password);
        if(!equal){
            throw new HttpException('Wrong Password',HttpStatus.BAD_REQUEST);
        }
        this.userRepository.save(user);
      
          const token:string =jwt.sign({
                                    id:user.id,email},
                                    process.env.SECRET,
                                    {
                                        expiresIn:'1d'
                                    }
                                    )
        
          const responseOBj:UserRO = {id:user.id,createdAt:user.createdAt,email:user.email,token}
        return responseOBj;
    }
   
    async signupStudent(data:StudentDTO){
        const {email,password,firstName,lastName,dob,code} = data;
        let user:UserEntity = await this.userRepository.findOne({where:{email}})
        if(user){
            throw new HttpException('Email already exists',HttpStatus.BAD_REQUEST);
        }
     
        user =  this.userRepository.create({email,password,userType:UserType.STUDENT});
        user.password = await bcrypt.hash(user.password,10);
        const student:StudentEntity = this.studentRepository.create({firstName,lastName,dob,code});
        student.user = user;
        user = await this.userRepository.save(user);
        await this.studentRepository.save(student);

        const responseOBj:UserRO = {id:user.id,createdAt:user.createdAt,email:user.email};

            return responseOBj;
    }
    async signupTeacher(data:TeacherDTO){
        
    }
    async signupEnterprise(data:EnterpriseDTO){

    }

    async forgotPassword(email:string){
       
        const user:UserEntity = await this.userRepository.findOne({where:{email}});
        if(!user){
             throw new HttpException("email does not exist",HttpStatus.BAD_REQUEST);
            // return 'email does not exist';
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
            from: '"booooooooooowaaa3 👻" <assoulsidali@gmail.com>', // sender address
            to: "sidalihouda.computerscience@gmail.com", // list of receivers separated by ,
            subject: "Hello ✔", // Subject line
            text: `Hello world? http://localhost:8080/resetpassword/${token}?uid=${user.id}`, // plain text body
            html: `<b>Hello world?</b> Hello world? http://localhost:3000/resetpassword/${token}/${user.id}`, // html body
          });
        
          console.log("Message sent: %s", info.messageId);
          // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        
          // Preview only available when sending through an Ethereal account
          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
          // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
          return "check you email please";
    }
    async resetPassword(password:string,token:string,userId:string){
        const resetPasswordToken:RestPasswordTokenEntity = await this.resetPasswordTokenRepository.findOne({where:{userId}})
        if(!resetPasswordToken){
            throw new HttpException("bad url",HttpStatus.FORBIDDEN);
        }
        if(resetPasswordToken.token!= token){
            throw new HttpException("wrong token",HttpStatus.FORBIDDEN);
        }
        if(resetPasswordToken.createdAt.getTime()+resetPasswordToken.expiresIn >= Date.now()){

            await this.resetPasswordTokenRepository.delete(resetPasswordToken.id);
            throw new HttpException("token expired!!",HttpStatus.BAD_REQUEST);
        }
        const user = await this.userRepository.findOne(userId);
        user.password = await bcrypt.hash(password,10);
        await this.userRepository.save(user);
        await this.resetPasswordTokenRepository.delete(resetPasswordToken.id);
        return `${user.email} password has been rest succesfully`;
    }

}