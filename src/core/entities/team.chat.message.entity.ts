import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { StudentEntity } from "./student.entity";
import { TeamEntity } from "./team.entity";

@Entity('team_chat_message')
export class TeamChatMessageEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    message:string;

    @CreateDateColumn()
    createdAt:Date;

    //relations
    @ManyToOne(type=>TeamEntity,team=>team.teamMessages)
    team:TeamEntity;

    @ManyToOne(type=>StudentEntity,student=>student.teamChatMessages)
    owner:StudentEntity;


}