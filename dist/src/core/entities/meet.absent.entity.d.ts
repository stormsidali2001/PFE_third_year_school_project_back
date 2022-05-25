import { MeetEntity } from './meet.entity';
import { StudentEntity } from './student.entity';
export declare class MeetAbsentEntity {
    id: string;
    cause: string;
    student: StudentEntity;
    meet: MeetEntity;
}
