import { TeamChatService } from "../services/team.chat.service";
export declare class TeamChatController {
    private readonly teamChatService;
    constructor(teamChatService: TeamChatService);
    sendTeamChatMessage(studentId: string, message: string): Promise<string>;
    getTeamMessages(userId: string): Promise<import("../../core/entities/team.chat.message.entity").TeamChatMessageEntity[]>;
}
