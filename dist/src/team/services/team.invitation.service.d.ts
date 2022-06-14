import { InvitationEntity } from "src/core/entities/invitation.entity";
import { StudentEntity } from "src/core/entities/student.entity";
import { SocketService } from "src/socket/socket.service";
import { UserService } from "src/user/user.service";
export declare class TeamInvitationService {
    private readonly userService;
    private socketService;
    constructor(userService: UserService, socketService: SocketService);
    sendATeamInvitation(userId: string, recieverId: string, description: string): Promise<string>;
    acceptRefuseTeamInvitation(invitationId: string, userId: string, accepted: boolean): Promise<string>;
    sendTeamJoinRequest(senderId: string, teamId: string, description: string): Promise<string>;
    getStudentsWithoutTeam(userId: string): Promise<StudentEntity[]>;
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
    getInvitations(studentId: string): Promise<InvitationEntity[]>;
}
