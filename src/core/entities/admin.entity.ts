import {  Column, Entity, JoinColumn, Long, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { NotificationEntity } from "./Notification.entity";
import { UserEntity } from "./user.entity";


@Entity('admin')
export class AdminEntity{
    @PrimaryGeneratedColumn('uuid')
    id:String;
  

    @Column()
    firstName:String;
    @Column()
    lastName:String;

    //relation
    @OneToOne(type=>UserEntity) @JoinColumn()
    user:UserEntity

   

}