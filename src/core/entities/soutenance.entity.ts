import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Jury_of } from "./juryOf.entity";
import { SalleEntity } from "./salle.entity";
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

    @OneToOne(type=>TeamEntity,{primary:true})  @JoinColumn()
    team:TeamEntity;

    @OneToMany(type=>Jury_of,jf=>jf.soutenance)
    jurys:Jury_of[];

    @ManyToOne(type=>SalleEntity,s=>s.soutenances)
    salle:SalleEntity;
}