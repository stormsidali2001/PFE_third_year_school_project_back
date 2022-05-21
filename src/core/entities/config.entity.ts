import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('config')
export class ConfigEntity{
    @PrimaryGeneratedColumn('increment')
    id:number;

    @Column({
        unique:true
    })
    key:string;

    @Column()
    value:string;

    @CreateDateColumn()
    createdAt:Date;
    


    
}