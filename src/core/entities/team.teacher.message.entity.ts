import { Check, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { StudentEntity } from "./student.entity";
import { TeacherEntity } from "./teacher.entity";
import { TeamEntity } from "./team.entity";

@Entity('team_teacher_chat_message')
@Check('(ownerS IS NOT NULL AND ownerT IS NULL) OR (ownerS IS NULL AND ownerT IS NOT NULL)')
export class TeamTeacherChatMessage{
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
    ownerS:StudentEntity;

    @ManyToOne(type=>TeacherEntity,teacher=>teacher.teamTeacherChatMessages)
    ownerT:TeacherEntity;


}