import { TeamEntity } from "./team.entity";
export declare class SoutenanceEntity {
    id: string;
    title: string;
    description: string;
    createdAt: Date;
    date: Date;
    duration: number;
    team: TeamEntity;
}
