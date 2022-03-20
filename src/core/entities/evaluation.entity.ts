import {Entity,Column,PrimaryGeneratedColumn,CreateDateColumn} from 'typeorm'
@Entity('evaluation')
export class EvaluationEntity{
   @PrimaryGeneratedColumn('uuid')
   id:string;

   @Column()
   score:number;

   @CreateDateColumn()
   createdAt:Date;

   @Column()
   comment:string;

   //relation

   
   
}