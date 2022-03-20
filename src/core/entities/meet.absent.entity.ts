
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { MeetEntity } from './meet.entity';
import { StudentEntity } from './student.entity';

@Entity('meet_absent')
export class MeetAbsentEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    cause:string;

    //relations
    @ManyToOne(type=>StudentEntity,student=>student.meetAbsences)
    student:StudentEntity;
    @ManyToOne(type=>MeetEntity,meet=>meet.absences)
    meet:MeetEntity;

    
}