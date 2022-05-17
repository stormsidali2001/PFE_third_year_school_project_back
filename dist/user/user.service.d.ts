import { NormalTeamMeetDto, SurveyDto, TeamAnnoncementDocDto, ThemeSuggestionDocDto, UrgentTeamMeetDto } from "src/core/dtos/user.dto";
import { InvitationEntity } from "src/core/entities/invitation.entity";
import { NotificationEntity } from "src/core/entities/Notification.entity";
import { StudentEntity } from "src/core/entities/student.entity";
import { SurveyEntity } from "src/core/entities/survey.entity";
import { SurveyOptionEntity } from "src/core/entities/survey.option.entity";
import { SurveyParticipantEntity } from "src/core/entities/survey.participant.entity";
import { TeamChatMessageEntity } from "src/core/entities/team.chat.message.entity";
import { TeamEntity } from "src/core/entities/team.entity";
import { UserEntity, UserType } from "src/core/entities/user.entity";
import { SchedulerRegistry } from '@nestjs/schedule';
import { SocketService } from "src/socket/socket.service";
import { AnnouncementDocumentEntity } from "src/core/entities/announcement.document.entity";
import { TeamDocumentEntity } from "src/core/entities/team.document.entity";
import { TeacherEntity } from "src/core/entities/teacher.entity";
import { ThemeSuggestionEntity } from "src/core/entities/theme.suggestion";
import { ThemeSuggestionDocumentEntity } from "src/core/entities/theme.suggestion.document.entity";
export declare class UserService {
    private schedulerRegistry;
    private socketService;
    constructor(schedulerRegistry: SchedulerRegistry, socketService: SocketService);
    getUserInfo(userId: string): Promise<{
        [x: string]: UserType | {
            id: string;
            code: string;
            firstName: string;
            lastName: string;
            dob: Date;
            team: TeamEntity;
            user: UserEntity;
            sentInvitations: InvitationEntity[];
            receivedInvitations: InvitationEntity[];
            teamChatMessages: TeamChatMessageEntity[];
            documents: TeamDocumentEntity[];
            participationsInSurveys: SurveyParticipantEntity[];
            meetAbsences: import("../core/entities/meet.absent.entity").MeetAbsentEntity[];
        } | {
            id: string;
            ssn: string;
            firstName: string;
            speciality: string;
            lastName: string;
            user: UserEntity;
            teamTeacherChatMessages: import("../core/entities/team.teacher.message.entity").TeamTeacherChatMessage[];
            encadrements: import("../core/entities/encadrement.entity").EncadrementEntity[];
            commitReviews: import("../core/entities/team.commit.review.entity").TeamCommitReviewEntity[];
            themeSuggestions: ThemeSuggestionEntity[];
        } | {
            id: String;
            firstName: String;
            lastName: String;
            user: UserEntity;
        } | {
            id: string;
            code: string;
            name: string;
            user: UserEntity;
        };
        userType: UserType;
    }>;
    sendATeamInvitation(userId: string, recieverId: string, description: string): Promise<string>;
    acceptRefuseTeamInvitation(invitationId: string, userId: string, accepted: boolean): Promise<string>;
    sendTeamJoinRequest(senderId: string, teamId: string, description: string): Promise<string>;
    getInvitations(studentId: string): Promise<InvitationEntity[]>;
    _sendNotfication(studentId: string, description: string): Promise<string>;
    _sendTeamNotfication(teamId: string, description: string, expectStudentId?: string, expectMessage?: string): Promise<string>;
    getLastNotifications(userId: string, number?: number): Promise<{
        notifications: NotificationEntity[];
        totalNotificationCount: number;
    }>;
    createTeamAnnouncement(userId: string, title: string, description: string, documents: TeamAnnoncementDocDto[]): Promise<void>;
    getAnnouncement(userId: string): Promise<{
        id: string;
        title: string;
        description: string;
        documents: AnnouncementDocumentEntity[];
    }[]>;
    sendTeamChatMessage(studentId: string, message: string): Promise<string>;
    createSurvey(userId: string, survey: SurveyDto): Promise<string>;
    submitSurveyAnswer(userId: string, surveyId: string, optionId: string, argument: string): Promise<"survey answered succesfully" | "answer updated succesfully">;
    getSurveys(userId: string): Promise<SurveyEntity[]>;
    getSurvey(userId: string, surveyId: string): Promise<{
        id: string;
        title: string;
        description: string;
        createdAt: Date;
        period: number;
        close: boolean;
        team: TeamEntity;
        options: SurveyOptionEntity[];
        participants: SurveyParticipantEntity[];
    }>;
    createNormalTeamMeet(studentId: string, meet: NormalTeamMeetDto): Promise<string>;
    createUrgentTeamMeet(studentId: string, meet: UrgentTeamMeetDto): Promise<string>;
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
    addTeamDocument(userId: string, name: string, url: string, description: string): Promise<void>;
    getTeamDocuments(userId: string): Promise<TeamDocumentEntity[]>;
    deleteTeamDocs(userId: string, docsIds: string[]): Promise<void>;
    getStudents(): Promise<StudentEntity[]>;
    deleteStudent(studentId: string): Promise<string>;
    editStudent(studentId: string, data: Partial<StudentEntity>): Promise<string>;
    getTeachers(): Promise<TeacherEntity[]>;
    deleteTeacher(teacherId: string): Promise<string>;
    editTeacher(teacherId: string, data: Partial<TeacherEntity>): Promise<string>;
    createThemeSuggestion(userId: string, title: string, description: string, documents: ThemeSuggestionDocDto[]): Promise<void>;
    getThemeSuggestions(): Promise<{
        id: string;
        title: string;
        description: string;
        documents: ThemeSuggestionDocumentEntity[];
    }[]>;
    getThemeSuggestion(themeId: string): Promise<ThemeSuggestionEntity>;
    getTeams(): Promise<{
        id: string;
        pseudo: string;
        theme: import("../core/entities/theme.entity").ThemeEntity;
        nombre: any;
    }[]>;
    getTeam(teamId: any): Promise<{
        id: string;
        pseudo: string;
        theme: import("../core/entities/theme.entity").ThemeEntity;
        members: StudentEntity[];
        description: string;
        rules: string;
    }>;
    getTeamMessages(userId: any): Promise<TeamChatMessageEntity[]>;
}
