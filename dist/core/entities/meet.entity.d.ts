import { MeetAbsentEntity } from './meet.absent.entity';
import { PvMeetEntity } from './pv.meet.entity';
import { TeamEntity } from './team.entity';
declare enum MeetType {
    URGENTE = "urgent",
    NORMAL = "normal"
}
export declare class MeetEntity {
    id: string;
    description: string;
    createdAt: Date;
    type: MeetType;
    team: TeamEntity;
    pvMeet: PvMeetEntity;
    absences: MeetAbsentEntity[];
}
export {};
