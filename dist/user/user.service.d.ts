import { NormalTeamMeetDto, SurveyDto, UrgentTeamMeetDto } from "src/core/dtos/user.dto";
import { InvitationEntity } from "src/core/entities/invitation.entity";
import { NotificationEntity } from "src/core/entities/Notification.entity";
import { SurveyEntity } from "src/core/entities/survey.entity";
import { SchedulerRegistry } from '@nestjs/schedule';
export declare class UserService {
    private schedulerRegistry;
    constructor(schedulerRegistry: SchedulerRegistry);
    getUserInfo(userId: string): Promise<any>;
    sendATeamInvitation(senderId: string, recieverId: string, description: string): Promise<string>;
    acceptRefuseTeamInvitation(invitationId: string, receiverId: string, accepted: boolean): Promise<string>;
    sendTeamJoinRequest(senderId: string, teamId: string, description: string): Promise<string>;
    getInvitations(studentId: string): Promise<InvitationEntity[]>;
    _sendNotfication(studentId: string, description: string): Promise<string>;
    _sendTeamNotfication(teamId: string, description: string, expectStudentId?: string, expectMessage?: string): Promise<string>;
    getNotifications(studentId: string): Promise<NotificationEntity[]>;
    createTeamAnnouncement(studentId: string, teamId: string, title: string, description: string): Promise<string>;
    sendTeamChatMessage(studentId: string, message: string): Promise<string>;
    createSurvey(studentId: string, survey: SurveyDto): Promise<string>;
    submitSurveyAnswer(studentId: string, surveyId: string, optionId: string, argument: string): Promise<"survey answered succesfully" | "answer updated succesfully">;
    getSurveys(teamId: string): Promise<SurveyEntity[]>;
    createNormalTeamMeet(studentId: string, meet: NormalTeamMeetDto): Promise<string>;
    createUrgentTeamMeet(studentId: string, meet: UrgentTeamMeetDto): Promise<string>;
}
