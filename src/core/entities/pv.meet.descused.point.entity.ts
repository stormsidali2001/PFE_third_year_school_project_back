import {Entity,PrimaryGeneratedColumn,Column, ManyToOne} from 'typeorm';
import { PvMeetEntity } from './pv.meet.entity';
@Entity('pv_meet_discused_point')
export class DiscusedPointEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string;;

    @Column()
    description:string;

    //relation
    @ManyToOne(type=>PvMeetEntity,pvMeet=>pvMeet.discusedPoints)
    pvMeet:PvMeetEntity;

}