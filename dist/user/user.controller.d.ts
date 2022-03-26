import { SurveyDto } from "src/core/dtos/user.dto";
import { UserService } from "./user.service";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getUserInfo(id: string): Promise<any>;
    sendATeamInvitation(senderId: string, receiverId: string, description: string): Promise<string>;
    acceptRefuseTeamInvitation(invitationId: string, accepted: boolean): Promise<string>;
    sendTeamJoinRequest(senderId: string, teamId: string, description: string): Promise<string>;
    getInvitations(studentId: string): Promise<import("../core/entities/invitation.entity").InvitationEntity[]>;
    createTeamAnnouncement(studentId: string, teamId: string, title: string, description: string): Promise<string>;
    sendTeamChatMessage(studentId: string, teamId: string, message: string): Promise<string>;
    createSurvey(studentId: string, survey: SurveyDto): Promise<string>;
}
