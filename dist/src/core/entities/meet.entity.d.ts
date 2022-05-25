import { MeetAbsentEntity } from './meet.absent.entity';
import { PvMeetEntity } from './pv.meet.entity';
import { TeamEntity } from './team.entity';
export declare enum MeetType {
    URGENTE = "urgent",
    NORMAL = "normal"
}
export declare class MeetEntity {
    id: string;
    title: string;
    description: string;
    date: Date;
    weekDay: number;
    hour: number;
    minute: number;
    second: number;
    createdAt: Date;
    type: MeetType;
    team: TeamEntity;
    pvs: PvMeetEntity[];
    absences: MeetAbsentEntity[];
}
