import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity("rest_password_token")
export class RestPasswordTokenEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    token:string;

    @CreateDateColumn()
    createdAt:Date;
    
    @Column()
    expiresIn:number;
    //relations
    @ManyToOne(type=>UserEntity,user=>user.tokens)
    user:UserEntity;
}