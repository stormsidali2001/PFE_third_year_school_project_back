import { Check, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { AdminEntity } from "./admin.entity";
import { EntrepriseEntity } from "./entreprise.entity";
import { StudentEntity } from "./student.entity";
import { TeacherEntity } from "./teacher.entity";
import { UserEntity } from "./user.entity";
@Entity('notification')
export class NotificationEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    description:string;

    @Column({
      default:false
    })
    seen:boolean;

    @CreateDateColumn()
    createdAt:Date;


  @ManyToOne(type=>UserEntity,user=>user.notifications)
  user:UserEntity;


}