import {  Column, Entity, JoinColumn, Long, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { NotificationEntity } from "./Notification.entity";
import { UserEntity } from "./user.entity";


@Entity('admin')
export class AdminEntity{
    @PrimaryGeneratedColumn('uuid')
    id:String;
    
    @PrimaryColumn()
    code:string;

    @Column()
    name:String;

    //relation
    @OneToOne(type=>UserEntity) @JoinColumn()
    user:UserEntity

   

}