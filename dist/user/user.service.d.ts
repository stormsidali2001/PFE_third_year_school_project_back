export declare class UserService {
    getUserInfo(userId: string): Promise<any>;
    sendATeamInvitation(senderId: string, recieverId: string, description: string): Promise<string>;
}
