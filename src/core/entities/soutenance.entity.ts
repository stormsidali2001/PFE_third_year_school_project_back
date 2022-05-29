import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { TeamEntity } from "./team.entity";




@Entity('soutenance')
export class SoutenanceEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    title:string;

    @Column()
    description:string;

    @CreateDateColumn()
    createdAt:Date;

    @Column()
    date:Date;

    @Column()
    duration:number;
    //relations

    @OneToOne(type=>TeamEntity)  @JoinColumn()
    team:TeamEntity;
}