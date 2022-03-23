import { UserService } from "./user.service";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getUserInfo(id: string): Promise<any>;
    sendATeamInvitation(senderId: string, receiverId: string, description: string): Promise<string>;
}
