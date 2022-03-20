import {Entity,PrimaryGeneratedColumn,Column, ManyToOne} from 'typeorm';
import { MeetEntity } from './meet.entity';
import { PvMeetEntity } from './pv.meet.entity';
@Entity('pv_meet_task_todo')
export class TaskTodoPvMeetEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string;;

    @Column()
    description:string;

    // //relations
    @ManyToOne(type=>PvMeetEntity,pvMeet=>pvMeet.tasksTodo)
    pvMeet:PvMeetEntity;

}