import { TeamEntity } from "./team.entity";
export declare class TeamChatMessageEntity {
    id: string;
    message: string;
    createdAt: Date;
    team: TeamEntity;
}
