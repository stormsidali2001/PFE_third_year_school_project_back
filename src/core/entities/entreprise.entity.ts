import {  Column, Entity, JoinColumn, Long, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { NotificationEntity } from "./Notification.entity";
import { ThemeEntity } from "./theme.entity";
import { UserEntity } from "./user.entity";


@Entity('entreprise')
export class EntrepriseEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string;
    
    @PrimaryColumn()
    code:string;

    @Column()
    name:string;

    //relation
    @OneToOne(type=>UserEntity) @JoinColumn()
    user:UserEntity;

    @OneToMany(type=>ThemeEntity,theme=>theme.suggestedByEntreprise)
    suggestedThemes:ThemeEntity[];

  

}