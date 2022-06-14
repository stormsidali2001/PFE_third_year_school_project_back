import { SocketService } from "src/socket/socket.service";
import { UserService } from "src/user/user.service";
export declare class TeamService {
    private readonly userService;
    private socketService;
    constructor(userService: UserService, socketService: SocketService);
    sendATeamInvitation(userId: string, recieverId: string, description: string): Promise<string>;
    acceptRefuseTeamInvitation(invitationId: string, userId: string, accepted: boolean): Promise<string>;
    sendTeamJoinRequest(senderId: string, teamId: string, description: string): Promise<string>;
}
