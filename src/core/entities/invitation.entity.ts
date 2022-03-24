import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { StudentEntity } from "./student.entity";

@Entity('invitation')
export class InvitationEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    description:string;


    //relations
    @ManyToOne(type=>StudentEntity,student=>student.sentInvitations)
    sender:StudentEntity;

    @ManyToOne(type=>StudentEntity,student=>student.receivedInvitations)
    reciever:StudentEntity;
}