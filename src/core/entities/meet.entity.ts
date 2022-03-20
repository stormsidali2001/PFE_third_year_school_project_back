import {Entity,Column,PrimaryGeneratedColumn,CreateDateColumn, ManyToOne, OneToOne, JoinColumn, OneToMany} from 'typeorm';
import { MeetAbsentEntity } from './meet.absent.entity';
import { PvMeetEntity } from './pv.meet.entity';
import { TeamEntity } from './team.entity';


enum MeetType {
    URGENTE = 'urgent',
    NORMAL = 'normal'
    
}
@Entity('meet')
export class MeetEntity{
   @PrimaryGeneratedColumn('uuid')
   id:string;

   @Column()
   description:string;

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

   @OneToOne(type=>PvMeetEntity) @JoinColumn()
   pvMeet:PvMeetEntity;

   @OneToMany(type=>MeetAbsentEntity,meetAbsent=>meetAbsent.meet)
   absences:MeetAbsentEntity[];

    

    
}