import { Column, PrimaryGeneratedColumn } from "typeorm";

export abstract class DoucmentData{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    name:string;

    @Column()
    url:string;
}