import {  Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RestPasswordTokenEntity } from "./resetPasswordToken.entity";

export enum UserType {
    TEACHER = 'teacher',
    STUDENT = 'student',
    ADMIN = 'admin',
    ENTERPRISE = 'enterprise'
}
@Entity('user')
export class UserEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @CreateDateColumn()
    createdAt:Date;

    @Column({
        unique:true,
    })
    email:string;
    
    @Column('text')
    password:string;

    @Column({
        type:'enum',
        enum:UserType,
        default:UserType.STUDENT
    })

    userType:UserType

    //relations
    @OneToMany(type=>RestPasswordTokenEntity,resetPasswordToken=>resetPasswordToken.token)
    tokens:RestPasswordTokenEntity[];
   
}