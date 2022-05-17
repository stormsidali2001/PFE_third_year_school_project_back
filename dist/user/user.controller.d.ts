/// <reference types="multer" />
import { NormalTeamMeetDto, SurveyDto, TeamAnnoncementDocDto, UrgentTeamMeetDto, ThemeSuggestionDocDto } from "src/core/dtos/user.dto";
import { UserService } from "./user.service";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    sendATeamInvitation(userId: string, recieverId: string, description: string): Promise<string>;
    acceptRefuseTeamInvitation(invitationId: string, accepted: boolean, userId: string): Promise<string>;
    sendTeamJoinRequest(senderId: string, teamId: string, description: string): Promise<string>;
    getInvitations(studentId: string): Promise<import("../core/entities/invitation.entity").InvitationEntity[]>;
    createTeamAnnouncement(userId: string, title: string, description: string, documents: TeamAnnoncementDocDto[]): Promise<void>;
    sendTeamChatMessage(studentId: string, message: string): Promise<string>;
    createSurvey(userId: string, survey: SurveyDto): Promise<string>;
    getAnnouncement(userId: string): Promise<{
        id: string;
        title: string;
        description: string;
        documents: import("../core/entities/announcement.document.entity").AnnouncementDocumentEntity[];
    }[]>;
    submitSurveyAnswer(userId: string, surveyId: string, optionId: string, argument: string): Promise<"survey answered succesfully" | "answer updated succesfully">;
    getSurveys(userId: string): Promise<import("../core/entities/survey.entity").SurveyEntity[]>;
    getSurvey(userId: string, surveyId: string): Promise<{
        id: string;
        title: string;
        description: string;
        createdAt: Date;
        period: number;
        close: boolean;
        team: import("../core/entities/team.entity").TeamEntity;
        options: import("../core/entities/survey.option.entity").SurveyOptionEntity[];
        participants: import("../core/entities/survey.participant.entity").SurveyParticipantEntity[];
    }>;
    createUrgentTeamMeet(studentId: string, meet: UrgentTeamMeetDto): Promise<string>;
    createNormalTeamMeet(studentId: string, meet: NormalTeamMeetDto): Promise<string>;
    getLastNotifications(userId: string, number: number): Promise<{
        notifications: import("../core/entities/Notification.entity").NotificationEntity[];
        totalNotificationCount: number;
    }>;
    getStudentsWithoutTeam(userId: string): Promise<import("../core/entities/student.entity").StudentEntity[]>;
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
    uploadFile(file: Express.Multer.File): Promise<{
        originalname: string;
        filename: string;
        destination: string;
    }>;
    seeUploadedFile(path: any, res: any): any;
    uploadFiles(files: Express.Multer.File[]): Promise<any[]>;
    addTeamDocument(userId: string, name: string, url: string, description: string): Promise<void>;
    getDocuments(userId: string): Promise<import("../core/entities/team.document.entity").TeamDocumentEntity[]>;
    deleteTeamDocs(userId: string, docsIds: string[]): Promise<void>;
    getStudents(): Promise<import("../core/entities/student.entity").StudentEntity[]>;
    deleteStudent(studentId: string): Promise<string>;
    editStudent(): Promise<void>;
    getTeachers(): Promise<import("../core/entities/teacher.entity").TeacherEntity[]>;
    deleteTeacher(teacherId: string): Promise<string>;
    editTeacher(): Promise<void>;
    createThemeSuggestion(userId: string, title: string, description: string, documents: ThemeSuggestionDocDto[]): Promise<void>;
    getThemeSuggestions(userId: string): Promise<{
        id: string;
        title: string;
        description: string;
        documents: import("../core/entities/theme.suggestion.document.entity").ThemeSuggestionDocumentEntity[];
    }[]>;
    getThemeSuggestion(themeId: string): Promise<import("../core/entities/theme.suggestion").ThemeSuggestionEntity>;
    getTeams(): Promise<{
        id: string;
        pseudo: string;
        theme: import("../core/entities/theme.entity").ThemeEntity;
        nombre: any;
    }[]>;
    getTeam(teamId: string): Promise<{
        id: string;
        pseudo: string;
        theme: import("../core/entities/theme.entity").ThemeEntity;
        members: import("../core/entities/student.entity").StudentEntity[];
        description: string;
        rules: string;
    }>;
    getUser(userId: string): Promise<{
        [x: string]: import("../core/entities/user.entity").UserType | {
            id: string;
            code: string;
            firstName: string;
            lastName: string;
            dob: Date;
            team: import("../core/entities/team.entity").TeamEntity;
            user: import("../core/entities/user.entity").UserEntity;
            sentInvitations: import("../core/entities/invitation.entity").InvitationEntity[];
            receivedInvitations: import("../core/entities/invitation.entity").InvitationEntity[];
            teamChatMessages: import("../core/entities/team.chat.message.entity").TeamChatMessageEntity[];
            documents: import("../core/entities/team.document.entity").TeamDocumentEntity[];
            participationsInSurveys: import("../core/entities/survey.participant.entity").SurveyParticipantEntity[];
            meetAbsences: import("../core/entities/meet.absent.entity").MeetAbsentEntity[];
        } | {
            id: string;
            ssn: string;
            firstName: string;
            speciality: string;
            lastName: string;
            user: import("../core/entities/user.entity").UserEntity;
            teamTeacherChatMessages: import("../core/entities/team.teacher.message.entity").TeamTeacherChatMessage[];
            encadrements: import("../core/entities/encadrement.entity").EncadrementEntity[];
            commitReviews: import("../core/entities/team.commit.review.entity").TeamCommitReviewEntity[];
            themeSuggestions: import("../core/entities/theme.suggestion").ThemeSuggestionEntity[];
        } | {
            id: String;
            firstName: String;
            lastName: String;
            user: import("../core/entities/user.entity").UserEntity;
        } | {
            id: string;
            code: string;
            name: string;
            user: import("../core/entities/user.entity").UserEntity;
        };
        userType: import("../core/entities/user.entity").UserType;
    }>;
    getTeamMessages(userId: string): Promise<import("../core/entities/team.chat.message.entity").TeamChatMessageEntity[]>;
    sendNotification(studentId: string, description: string): Promise<string>;
}
