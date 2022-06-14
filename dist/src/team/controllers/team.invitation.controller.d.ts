import { TeamInvitationService } from "../services/team.invitation.service";
export declare class TeamInvitationController {
    private readonly teamInvitationService;
    constructor(teamInvitationService: TeamInvitationService);
    sendATeamInvitation(userId: string, recieverId: string, description: string): Promise<string>;
    acceptRefuseTeamInvitation(invitationId: string, accepted: boolean, userId: string): Promise<string>;
    sendTeamJoinRequest(senderId: string, teamId: string, description: string): Promise<string>;
    getStudentsWithoutTeam(userId: string): Promise<import("../../core/entities/student.entity").StudentEntity[]>;
    getInvitationList(userId: string): Promise<({
        id: string;
        description: string;
        senderTeam: {
            id: string;
            nickname: string;
            teamLeader: {
                id: string;
                firstname: string;
                lastName: string;
            };
        };
        student?: undefined;
    } | {
        id: string;
        description: string;
        student: {
            id: string;
            firstname: string;
            lastName: string;
        };
        senderTeam?: undefined;
    })[]>;
    getInvitations(studentId: string): Promise<import("../../core/entities/invitation.entity").InvitationEntity[]>;
}
