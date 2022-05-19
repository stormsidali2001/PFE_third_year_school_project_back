import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('config')
export class ConfigEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    key:string;

    @Column()
    value:string;

    @CreateDateColumn()
    createdAt:Date;

    
}