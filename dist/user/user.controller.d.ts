import { NormalTeamMeetDto, SurveyDto, UrgentTeamMeetDto } from "src/core/dtos/user.dto";
import { UserService } from "./user.service";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getUserInfo(id: string): Promise<any>;
    sendATeamInvitation(senderId: string, receiverId: string, description: string): Promise<string>;
    acceptRefuseTeamInvitation(invitationId: string, accepted: boolean, recieverId: string): Promise<string>;
    sendTeamJoinRequest(senderId: string, teamId: string, description: string): Promise<string>;
    getInvitations(studentId: string): Promise<import("../core/entities/invitation.entity").InvitationEntity[]>;
    createTeamAnnouncement(studentId: string, teamId: string, title: string, description: string): Promise<string>;
    sendTeamChatMessage(studentId: string, message: string): Promise<string>;
    createSurvey(studentId: string, survey: SurveyDto): Promise<string>;
    submitSurveyAnswer(studentId: string, surveyId: string, optionId: string, argument: string): Promise<"survey answered succesfully" | "answer updated succesfully">;
    getSurveys(teamId: string): Promise<import("../core/entities/survey.entity").SurveyEntity[]>;
    createUrgentTeamMeet(studentId: string, meet: UrgentTeamMeetDto): Promise<string>;
    createNormalTeamMeet(studentId: string, meet: NormalTeamMeetDto): Promise<string>;
    getLastNotifications(userId: string, number: number): Promise<import("../core/entities/Notification.entity").NotificationEntity[]>;
    sendNotification(studentId: string, description: string): Promise<string>;
}
