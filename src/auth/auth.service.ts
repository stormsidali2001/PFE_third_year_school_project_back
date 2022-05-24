import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "src/core/repositories/user.repository";
import { AdminDto, EnterpriseDTO, StudentDTO, StudentTestDTO, TeacherDTO, TeacherTestDTO, UserDTO, UserRO } from "../core/dtos/user.dto";
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
import { getConnection, getManager, getRepository } from "typeorm";
import * as argon from 'argon2'
import { SocketService } from "src/socket/socket.service";
import { AdminEntity } from "src/core/entities/admin.entity";
import { TeacherEntity } from "src/core/entities/teacher.entity";
import { PromotionEntity } from "src/core/entities/promotion.entity";
import { UserService } from "src/user/user.service";



@Injectable()
export class AuthService{
    constructor( 
        private userRepository:UserRepository,
        private studentRepository:StudentRepository,
        private resetPasswordTokenRepository:RestPasswordTokenRepository,
        private jwtService:JwtService,
        private socketService:SocketService,
        private userService:UserService
        ){}
    async signin(data:UserDTO){
        
        const manager = getManager();
        const {email,password} = data;
        const user = await this.userRepository.findOne({where:{email}})
        if(!user){
            
            Logger.error("Email does not exists",'signin/AuthService')
            throw new HttpException('Email does not exists',HttpStatus.BAD_REQUEST);
        }
        const equal:boolean = await bcrypt.compare(password,user.password);
        if(!equal){
            Logger.error("Wrong Password",'signin/AuthService')
            throw new HttpException('Wrong Password',HttpStatus.BAD_REQUEST);
        }
      
        /**
         * for jwt 
         */
        //   const tokens:Tokens = await this._getTokens(user.id,user.email);
        //   await this._updateRefrechTokenHash(user.id,tokens.refrechToken)
         /**
         * for jwt  x
         */
       return {id:user.id}
             
        

         
         

        
    }

    async signupStudent(userId:string,data:StudentDTO){
        try{
        const manager = getManager()
        const connectedUser = await manager.getRepository(UserEntity).createQueryBuilder('cuser')
        .where('cuser.id = :userId',{userId})
        .getOne()

        if(connectedUser.userType !== UserType.ADMIN){
            Logger.error("permission denied","signupStudent")
            throw new HttpException("permission denied",HttpStatus.BAD_REQUEST);

        }
        
        const {email,firstName,lastName,dob,code,promotionId,moy} = data;
        const promotion = await manager.getRepository(PromotionEntity)
        .createQueryBuilder('promotion')
        .where('promotion.id = :promotionId',{promotionId})
        .getOne();

        if(!promotion){
            Logger.error("promotion not found","signupStudent")
            throw new HttpException("promotion not found",HttpStatus.BAD_REQUEST);

        }

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
      
        var randomPassword:string =await new Promise((resolve,reject)=>{
            randomBytes(32,(err,buf)=>{
                if(err) reject(err);
                resolve(buf.toString('hex'))
            })
        }) 
        user =  this.userRepository.create({email,password:randomPassword,userType:UserType.STUDENT});
        user.password = await bcrypt.hash(user.password,10);
        const student:StudentEntity = this.studentRepository.create({firstName,lastName,dob,code,promotion,moy});
        student.user = user;
        await getConnection().transaction(async manager=>{

            user = await manager.getRepository(UserEntity).save(user);
              await manager.getRepository(StudentEntity).save(student);
        })
        await this.userService._sendNotfication(connectedUser.id,`etudiant: ${student.firstName} ${student.lastName} ajoutés avec success`)

       

        //     return tokens;
        }catch(err){
            Logger.error(err,"AuthService/signupStudent")
            throw new HttpException(err,HttpStatus.BAD_REQUEST)
        }
    }
    async signupStudents(userId:string,data:StudentDTO[]){
        try{

            const manager = getManager()
            const connectedUser = await manager.getRepository(UserEntity).createQueryBuilder('cuser')
            .where('cuser.id = :userId',{userId})
            .getOne()
    
            if(connectedUser.userType !== UserType.ADMIN){
                Logger.error("permission denied","signupStudent")
                throw new HttpException("permission denied",HttpStatus.BAD_REQUEST);
    
            }

            const students = [];
            const users = [];

        
      
        for(let key in data){
            const studentData = data[key];
            console.log("student data",studentData)
            const {email,firstName,lastName,dob,code,promotionId,moy} = studentData;

            const promotion = await manager.getRepository(PromotionEntity)
            .createQueryBuilder('promotion')
            .where('promotion.id = :promotionId',{promotionId})
            .getOne();
    
            if(!promotion){
                Logger.error("promotion not found","signupStudentTest")
                throw new HttpException("promotion not found",HttpStatus.BAD_REQUEST);
    
            }

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
          
            var randomPassword:string =await new Promise((resolve,reject)=>{
                randomBytes(32,(err,buf)=>{
                    if(err) reject(err);
                    resolve(buf.toString('hex'))
                })
            }) 
            user =  this.userRepository.create({email,password:randomPassword,userType:UserType.STUDENT});
            user.password = await bcrypt.hash(user.password,10);
            const student:StudentEntity = this.studentRepository.create({firstName,lastName,dob,code,promotion,moy});
            student.user = user;
            users.push(user)
            students.push(student)
        }
         

        Logger.log("starting exevuting db save","AuthService/signupStudents")
      await  getConnection().transaction(async manager=>{
        await manager.getRepository(UserEntity).save(users)
        await manager.getRepository(StudentEntity).save(students);
    })
    await this.userService._sendNotfication(connectedUser.id,`${students.length} etudiants sont ajoutés avec success`)
        

        Logger.log(students,"AuthService/signupStudents")
        return students;
        
        }catch(err){
            Logger.error(err,"AuthService/signupStudents")
            throw new HttpException(err,HttpStatus.BAD_REQUEST)
        }
    }
     
    async signupTeacher(userId:string,data:TeacherDTO){
        try{

            const manager = getManager()
            const connectedUser = await manager.getRepository(UserEntity).createQueryBuilder('cuser')
            .where('cuser.id = :userId',{userId})
            .getOne()
    
            if(connectedUser.userType !== UserType.ADMIN){
                Logger.error("permission denied","signupStudent")
                throw new HttpException("permission denied",HttpStatus.BAD_REQUEST);
    
            }

            const {email,firstName,lastName,ssn,speciality} = data;
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
          
            var randomPassword:string =await new Promise((resolve,reject)=>{
                randomBytes(32,(err,buf)=>{
                    if(err) reject(err);
                    resolve(buf.toString('hex'))
                })
            }) 
            user =  this.userRepository.create({email,password:randomPassword,userType:UserType.TEACHER});
            user.password = await bcrypt.hash(user.password,10);
            const teacherRepository = manager.getRepository(TeacherEntity);
            const teacher:TeacherEntity = teacherRepository.create({firstName,lastName,ssn,speciality});
            teacher.user = user;
            await getConnection().transaction(async manager=>{
                user = await manager.getRepository(UserEntity).save(user);
                await manager.getRepository(TeacherEntity).save(teacher);

            })

            await this.userService._sendNotfication(connectedUser.id,`ensiegnant ${teacher.id} est ajouté.`)

          
            }catch(err){
                Logger.error(err,"AuthService/signupStudent")
                throw new HttpException(err,HttpStatus.BAD_REQUEST)
            }
        
    }
    async signupTeachers(userId,data:TeacherDTO[]){
        try{
            const manager = getManager()
            const connectedUser = await manager.getRepository(UserEntity).createQueryBuilder('cuser')
            .where('cuser.id = :userId',{userId})
            .getOne()
    
            if(connectedUser.userType !== UserType.ADMIN){
                Logger.error("permission denied","signupStudent")
                throw new HttpException("permission denied",HttpStatus.BAD_REQUEST);
    
            }

            const teachers = [];
            const users = [];
            for(let key in data){
                const teacherData = data[key];
              
                const {email,firstName,lastName,ssn,speciality} = teacherData;
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
              
                var randomPassword:string =await new Promise((resolve,reject)=>{
                    randomBytes(32,(err,buf)=>{
                        if(err) reject(err);
                        resolve(buf.toString('hex'))
                    })
                }) 
                user =  this.userRepository.create({email,password:randomPassword,userType:UserType.TEACHER});
                user.password = await bcrypt.hash(user.password,10);
                const teacher:TeacherEntity = manager.getRepository(TeacherEntity).create({firstName,lastName,ssn,speciality});
                teacher.user = user;
                users.push(user)
                teachers.push(teacher)
            }
             
    
            Logger.log("starting exevuting db save","AuthService/signupStudents")
           await getConnection().transaction(async manager =>{
                await manager.getRepository(UserEntity).save(users)
                await manager.getRepository(TeacherEntity).save(teachers);

            })
          
            
            await this.userService._sendNotfication(connectedUser.id,` ${teachers.length} ensiegnats sont ajoutés.`)

            Logger.log(teachers,"AuthService/signupteachers")
            return teachers;
            }catch(err){
                Logger.error(err,"AuthService/signupteachers")
                throw new HttpException(err,HttpStatus.BAD_REQUEST)
            }
    }
    async signupEnterprise(data:EnterpriseDTO){

    }
    async signupAdmin(admin:AdminDto){
        const {firstName,lastName,password,email} = admin;
        try{
            const manager = getManager();
          
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
         
            user =  this.userRepository.create({email,password,userType:UserType.ADMIN});
            user.password = await bcrypt.hash(user.password,10);
            const adminRepository = manager.getRepository(AdminEntity);
            const admin = adminRepository.create({firstName,lastName})
            admin.user = user;
            user = await this.userRepository.save(user);

            await adminRepository.save(admin);
            
            return {...admin,user}
        }catch(err){
            Logger.log(err,"AuthService/signupAdmin")
            throw new HttpException(err,HttpStatus.BAD_REQUEST)

        }
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
            from: '"It experts" <assoulsidali@gmail.com>', // sender address
            to: email, // list of receivers separated by ,
            subject: "Mot de pasee oublié", // Subject line
            html: `<b>vous avez envoyer une demmande de réinitialisation de mot de passe.</b><br/> presser sur le lien si il s'agit bien de vous </b><br/> le lien:  http://localhost:3000/resetpassword/${token}?uid=${user.id}`, // html body
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

    /**
     * 
     * test functions
     */
     async signupStudentTest(data:StudentTestDTO){
        try{

        const manager = getManager()
        const {email,password,firstName,lastName,dob,code,promotionId,moy} = data;
        const promotion = await manager.getRepository(PromotionEntity)
        .createQueryBuilder('promotion')
        .where('promotion.id = :promotionId',{promotionId})
        .getOne();

        if(!promotion){
            Logger.error("promotion not found","signupStudentTest")
            throw new HttpException("promotion not found",HttpStatus.BAD_REQUEST);

        }

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
        const student:StudentEntity = this.studentRepository.create({firstName,lastName,dob,code,promotion,moy});
        student.user = user;
        user = await this.userRepository.save(user);
        await this.studentRepository.save(student);

        // const tokens:Tokens = await this._getTokens(user.id,user.email);
        // await this._updateRefrechTokenHash(user.id,tokens.refrechToken)

        //     return tokens;
        }catch(err){
            Logger.error(err,"AuthService/signupStudent")
            throw new HttpException(err,HttpStatus.BAD_REQUEST)
        }
    }
    async signupTeacherTest(data:TeacherTestDTO){
        try{

            const manager = getManager()
            const {email,firstName,lastName,ssn,speciality,password} = data;
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
     
        user =  this.userRepository.create({email,password,userType:UserType.TEACHER});
        user.password = await bcrypt.hash(user.password,10);
          
        
            const teacherRepository = manager.getRepository(TeacherEntity);
            const teacher:TeacherEntity = teacherRepository.create({firstName,lastName,ssn,speciality});
            teacher.user = user;
            user = await this.userRepository.save(user);
            await teacherRepository.save(teacher);
            }catch(err){
                Logger.error(err,"AuthService/signupStudent")
                throw new HttpException(err,HttpStatus.BAD_REQUEST)
            }
        
    }
    
   



/**
 * 
 * @param userId 
 * 
 * @param refrechToken 
 * 
 * just for refference
 * @returns 
 */






















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