import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SoutenanceEntity } from "./soutenance.entity";
import { TeacherEntity } from "./teacher.entity";



@Entity('jury_of')
export class Jury_of{
    
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @CreateDateColumn()
    createdAt:Date;
    //relations

    @ManyToOne(type=>SoutenanceEntity,s=>s.jurys)
    soutenance:SoutenanceEntity;

    @ManyToOne(type=>TeacherEntity,t=>t.soutenances)
    teacher:TeacherEntity;
    
}