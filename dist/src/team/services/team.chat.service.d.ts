import { TeamChatMessageEntity } from "src/core/entities/team.chat.message.entity";
export declare class TeamChatService {
    sendTeamChatMessage(studentId: string, message: string): Promise<string>;
    getTeamMessages(userId: any): Promise<TeamChatMessageEntity[]>;
}
