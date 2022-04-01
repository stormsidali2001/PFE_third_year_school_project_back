import {Entity,Column,PrimaryGeneratedColumn,CreateDateColumn, ManyToOne, OneToOne, JoinColumn, OneToMany} from 'typeorm';
import { MeetAbsentEntity } from './meet.absent.entity';
import { PvMeetEntity } from './pv.meet.entity';
import { TeamEntity } from './team.entity';


export enum MeetType {
    URGENTE = 'urgent',
    NORMAL = 'normal',
}
@Entity('meet')
export class MeetEntity{
   @PrimaryGeneratedColumn('uuid')
   id:string;
   @Column()
   title:string;
   @Column()
   description:string;

   @Column({default:null})
   date:Date;

   @Column({default:null})
   weekDay:number;
   @Column({default:null})
    hour:number;
    @Column({default:null})
    minute:number;
    @Column({default:null})
    second:number;
   @CreateDateColumn()
   createdAt:Date;

   @Column({
       type:'enum',
       enum:MeetType,
       default:MeetType.NORMAL

   })
   type:MeetType;

   //relations

   @ManyToOne(type=>TeamEntity,team=>team.meets)
   team:TeamEntity;

   @ManyToOne(type=>PvMeetEntity,pv=>pv.meet) 
   pvs:PvMeetEntity[];

   @OneToMany(type=>MeetAbsentEntity,meetAbsent=>meetAbsent.meet)
   absences:MeetAbsentEntity[];

    

    
}