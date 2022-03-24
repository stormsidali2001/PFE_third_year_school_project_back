import { InvitationEntity } from "src/core/entities/invitation.entity";
export declare class UserService {
    getUserInfo(userId: string): Promise<any>;
    sendATeamInvitation(senderId: string, recieverId: string, description: string): Promise<string>;
    acceptRefuseTeamInvitation(invitationId: string, accepted: boolean): Promise<string>;
    sendTeamJoinRequest(senderId: string, teamId: string, description: string): Promise<string>;
    getInvitations(studentId: string): Promise<InvitationEntity[]>;
}
