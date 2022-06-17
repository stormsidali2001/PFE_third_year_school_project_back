import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TeacherEntity } from "./teacher.entity";
import { TeamEntity } from "./team.entity";
import { ThemeEntity } from "./theme.entity";



@Entity('responsible')
export class ResponsibleEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @CreateDateColumn()
    createdAt:Date;

    //relations
    @ManyToOne(type=>TeacherEntity,teacher=>teacher.teamsInCharge)
    teacher:TeacherEntity;

    @ManyToOne(type=>TeamEntity,team=>team.responsibleTeachers)
    team:TeamEntity;

    @ManyToOne(type=>ThemeEntity,theme=>theme.resbonsibilities)
    theme:ThemeEntity
}