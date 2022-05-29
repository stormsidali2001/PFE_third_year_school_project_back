import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SoutenanceEntity } from "./soutenance.entity";



@Entity('salle')
export class SalleEntity{
    
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({
        unique:true
    })
    name:string;


    //relations

    @ManyToOne(type=>SoutenanceEntity,s=>s.salle)
    soutenances:SoutenanceEntity[];
}