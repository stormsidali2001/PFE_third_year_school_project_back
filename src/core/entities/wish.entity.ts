import {  Column, CreateDateColumn,ManyToOne, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import {TeamEntity} from './team.entity'
import {ThemeEntity} from './theme.entity'
@Entity('wish')
export class WishEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @CreateDateColumn()
    createdAt:Date;

    @Column()
    order:number;

    //relations
    @ManyToOne(type=>TeamEntity,team=>team.wishes)
    team:TeamEntity;

    @ManyToOne(type=>ThemeEntity,theme=>theme.wishes)
    theme:ThemeEntity;
}