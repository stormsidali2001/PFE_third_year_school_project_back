import { SurveyDto } from "src/core/dtos/user.dto";
import { InvitationEntity } from "src/core/entities/invitation.entity";
import { NotificationEntity } from "src/core/entities/Notification.entity";
export declare class UserService {
    getUserInfo(userId: string): Promise<any>;
    sendATeamInvitation(senderId: string, recieverId: string, description: string): Promise<string>;
    acceptRefuseTeamInvitation(invitationId: string, accepted: boolean): Promise<string>;
    sendTeamJoinRequest(senderId: string, teamId: string, description: string): Promise<string>;
    getInvitations(studentId: string): Promise<InvitationEntity[]>;
    _sendNotfication(studentId: string, description: string): Promise<string>;
    _sendTeamNotfication(teamId: string, description: string, expectStudentId?: string, expectMessage?: string): Promise<string>;
    getNotifications(studentId: string): Promise<NotificationEntity[]>;
    createTeamAnnouncement(studentId: string, teamId: string, title: string, description: string): Promise<string>;
    sendTeamChatMessage(studentId: string, teamId: string, message: string): Promise<string>;
    createSurvey(studentId: string, survey: SurveyDto): Promise<string>;
}
