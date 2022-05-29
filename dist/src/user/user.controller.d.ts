/// <reference types="multer" />
import { StreamableFile } from "@nestjs/common";
import { NormalTeamMeetDto, SurveyDto, TeamAnnoncementDocDto, UrgentTeamMeetDto, ThemeDocDto, WishListDTO, ThemeToTeamDTO } from "src/core/dtos/user.dto";
import { UserService } from "./user.service";
import { UserEntity, UserType } from "src/core/entities/user.entity";
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
    getSurveyParticipantsArguments(userId: string, surveyId: string, optionId: string): Promise<import("../core/entities/survey.participant.entity").SurveyParticipantEntity[]>;
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
    downlaodFile(url: string, userId: string): Promise<StreamableFile | "file not found">;
    seeUploadedFile(path: any, res: any): any;
    uploadFiles(files: Express.Multer.File[]): Promise<any[]>;
    addTeamDocument(userId: string, name: string, url: string, description: string, typeDocId: string): Promise<void>;
    getDocuments(userId: string): Promise<import("../core/entities/team.document.entity").TeamDocumentEntity[]>;
    deleteTeamDocs(userId: string, docsIds: string[]): Promise<void>;
    commitDocs(userId: string, title: string, description: string, docsIds: string[]): Promise<void>;
    getTeamsTeacherResponsibleFor(userId: string): Promise<import("../core/entities/team.entity").TeamEntity[]>;
    getTeamsTeacherResponsibleForWithMembers(userId: string, promotionId: string): Promise<import("../core/entities/team.entity").TeamEntity[]>;
    getAllDocsAdmin(userId: string, promotionId: string, teamId: string): Promise<import("../core/entities/commit.document.entity").CommitDocumentEntity[]>;
    getTeamCommits(userId: string, teamId: string): Promise<import("../core/entities/commit.entity").CommitEntity[]>;
    getAllCommitsDocs(userId: string, teamId: string): Promise<import("../core/entities/commit.document.entity").CommitDocumentEntity[]>;
    validatedDocument(userId: string, documentIds: string[]): Promise<void>;
    getStudents(): Promise<import("../core/entities/student.entity").StudentEntity[]>;
    deleteStudent(studentId: string): Promise<string>;
    editStudent(): Promise<void>;
    getTeachers(): Promise<import("../core/entities/teacher.entity").TeacherEntity[]>;
    deleteTeacher(teacherId: string): Promise<string>;
    editTeacher(): Promise<void>;
    createThemeSuggestion(userId: string, title: string, description: string, documents: ThemeDocDto[], promotionId: string): Promise<void>;
    getThemeSuggestions(promotionId: string): Promise<import("../core/entities/theme.entity").ThemeEntity[]>;
    getAllThemeSuggestions(): Promise<import("../core/entities/theme.entity").ThemeEntity[]>;
    getThemeSuggestion(themeId: string): Promise<import("../core/entities/theme.entity").ThemeEntity>;
    validateThemeSuggestion(userId: string, themeId: string): Promise<void>;
    getAllThemes(): Promise<import("../core/entities/theme.entity").ThemeEntity[]>;
    getThemes(promotionId: string): Promise<import("../core/entities/theme.entity").ThemeEntity[]>;
    getTheme(themeId: string): Promise<import("../core/entities/theme.entity").ThemeEntity>;
    getTeams(promotionId: string): Promise<{
        id: string;
        pseudo: string;
        theme: import("../core/entities/theme.entity").ThemeEntity;
        nombre: any;
        promotion: string;
        validated: boolean;
    }[]>;
    getTeam(teamId: string): Promise<{
        id: string;
        pseudo: string;
        theme: import("../core/entities/theme.entity").ThemeEntity;
        members: import("../core/entities/student.entity").StudentEntity[];
        promotion: import("../core/entities/promotion.entity").PromotionEntity;
        validated: boolean;
        teamLeader: import("../core/entities/student.entity").StudentEntity;
    }>;
    getUser(userId: string): Promise<{
        [x: string]: string | {
            id: string;
            code: string;
            firstName: string;
            lastName: string;
            dob: Date;
            moy: number;
            team: import("../core/entities/team.entity").TeamEntity;
            user: UserEntity;
            sentInvitations: import("../core/entities/invitation.entity").InvitationEntity[];
            receivedInvitations: import("../core/entities/invitation.entity").InvitationEntity[];
            teamChatMessages: import("../core/entities/team.chat.message.entity").TeamChatMessageEntity[];
            documents: import("../core/entities/team.document.entity").TeamDocumentEntity[];
            participationsInSurveys: import("../core/entities/survey.participant.entity").SurveyParticipantEntity[];
            meetAbsences: import("../core/entities/meet.absent.entity").MeetAbsentEntity[];
            promotion: import("../core/entities/promotion.entity").PromotionEntity;
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
            suggestedThemes: import("../core/entities/theme.entity").ThemeEntity[];
            teamsInCharge: import("../core/entities/responsible.entity").ResponsibleEntity[];
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
            suggestedThemes: import("../core/entities/theme.entity").ThemeEntity[];
        };
        userType: UserType;
        email: string;
    }>;
    getTeamMessages(userId: string): Promise<import("../core/entities/team.chat.message.entity").TeamChatMessageEntity[]>;
    submitWishList(userId: string, data: WishListDTO): Promise<void>;
    getAllPromotions(): Promise<import("../core/entities/promotion.entity").PromotionEntity[]>;
    asignThemesToTeams(userId: string, promotionId: string, method: string): Promise<{
        theme: {
            id: string;
            title: string;
        };
        teams: any;
    }[]>;
    applyThemesToTeamsAssignements(userId: string, data: ThemeToTeamDTO): Promise<any>;
    encadrerTheme(userId: string, themeId: string, teacherId: string): Promise<void>;
    assignTeamsToTeacher(userId: string, teamIds: string[], teacherId: string): Promise<void>;
    getPromotionDocumentTypes(userId: any): Promise<import("../core/entities/document-types.entity").DocumentTypeEntity[]>;
    sendNotification(userId: string, description: string): Promise<string>;
    createNewConfig(key: string, value: string): Promise<void>;
    createNewPromotion(name: string, documentTypes: string[]): Promise<void>;
}
