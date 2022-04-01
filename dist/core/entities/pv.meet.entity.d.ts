import { MeetEntity } from './meet.entity';
import { DiscusedPointEntity } from './pv.meet.descused.point.entity';
import { TaskTodoPvMeetEntity } from './pv.meet.task.todo.entity';
export declare class PvMeetEntity {
    id: string;
    description: string;
    nextMeetAproximateDate: Date;
    duration: Date;
    location: string;
    discusedPoints: DiscusedPointEntity[];
    tasksTodo: TaskTodoPvMeetEntity[];
    meet: MeetEntity;
}
