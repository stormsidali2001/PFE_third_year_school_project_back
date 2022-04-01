import {Entity,PrimaryGeneratedColumn,Column, OneToOne, JoinColumn, OneToMany, ManyToOne} from 'typeorm'
import { MeetEntity } from './meet.entity';
import { DiscusedPointEntity } from './pv.meet.descused.point.entity';
import { TaskTodoPvMeetEntity } from './pv.meet.task.todo.entity';

@Entity('pv_meet')
export class PvMeetEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    description:string;

    @Column()
    nextMeetAproximateDate:Date;

    @Column('time')
    duration:Date;

    @Column()
    location:string;

    //relations
    @OneToMany(type=>DiscusedPointEntity,discusedPoint=>discusedPoint.pvMeet)
    discusedPoints:DiscusedPointEntity[];

    @OneToMany(type=>TaskTodoPvMeetEntity,taskTodo=>taskTodo.pvMeet)
    tasksTodo:TaskTodoPvMeetEntity[];

    @ManyToOne(type=>MeetEntity,meet=>meet.pvs)
    meet:MeetEntity;

}