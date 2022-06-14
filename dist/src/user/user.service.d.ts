import { NormalTeamMeetDto, SoutenanceDto, ThemeDocDto, ThemeToTeamDTO, UrgentTeamMeetDto, WishListDTO } from "src/core/dtos/user.dto";
import { InvitationEntity } from "src/core/entities/invitation.entity";
import { NotificationEntity } from "src/core/entities/Notification.entity";
import { StudentEntity } from "src/core/entities/student.entity";
import { SurveyParticipantEntity } from "src/core/entities/survey.participant.entity";
import { TeamChatMessageEntity } from "src/core/entities/team.chat.message.entity";
import { TeamEntity } from "src/core/entities/team.entity";
import { UserEntity, UserType } from "src/core/entities/user.entity";
import { SchedulerRegistry } from '@nestjs/schedule';
import { SocketService } from "src/socket/socket.service";
import { TeamDocumentEntity } from "src/core/entities/team.document.entity";
import { TeacherEntity } from "src/core/entities/teacher.entity";
import { ThemeEntity } from "src/core/entities/theme.entity";
import { PromotionEntity } from "src/core/entities/promotion.entity";
import { EncadrementEntity } from "src/core/entities/encadrement.entity";
import { ResponsibleEntity } from "src/core/entities/responsible.entity";
import { DocumentTypeEntity } from "src/core/entities/document-types.entity";
import { CommitDocumentEntity } from "src/core/entities/commit.document.entity";
import { CommitEntity } from "src/core/entities/commit.entity";
import { SalleEntity } from "src/core/entities/salle.entity";
import { SoutenanceEntity } from "src/core/entities/soutenance.entity";
import { Jury_of } from "src/core/entities/juryOf.entity";
export declare class UserService {
    private schedulerRegistry;
    private socketService;
    constructor(schedulerRegistry: SchedulerRegistry, socketService: SocketService);
    getUserInfo(userId: string): Promise<{
        [x: string]: string | {
            id: string;
            code: string;
            firstName: string;
            lastName: string;
            dob: Date;
            moy: number;
            team: TeamEntity;
            user: UserEntity;
            sentInvitations: InvitationEntity[];
            receivedInvitations: InvitationEntity[];
            teamChatMessages: TeamChatMessageEntity[];
            documents: TeamDocumentEntity[];
            participationsInSurveys: SurveyParticipantEntity[];
            meetAbsences: import("../core/entities/meet.absent.entity").MeetAbsentEntity[];
            promotion: PromotionEntity;
        } | {
            id: string;
            code: string;
            name: string;
            user: UserEntity;
            suggestedThemes: ThemeEntity[];
        } | {
            id: string;
            ssn: string;
            firstName: string;
            speciality: string;
            lastName: string;
            user: UserEntity;
            teamTeacherChatMessages: import("../core/entities/team.teacher.message.entity").TeamTeacherChatMessage[];
            encadrements: EncadrementEntity[];
            commitReviews: import("../core/entities/team.commit.review.entity").TeamCommitReviewEntity[];
            suggestedThemes: ThemeEntity[];
            teamsInCharge: ResponsibleEntity[];
            soutenances: Jury_of[];
        } | {
            id: String;
            firstName: String;
            lastName: String;
            user: UserEntity;
        };
        userType: UserType;
        email: string;
    }>;
    _sendNotficationStudent(studentId: string, description: string): Promise<string>;
    _sendTeamNotfication(teamId: string, description: string, expectStudentId?: string, expectMessage?: string): Promise<string>;
    _sendNotfication(userId: string, description: string): Promise<string>;
    getLastNotifications(userId: string, number?: number): Promise<{
        notifications: NotificationEntity[];
        totalNotificationCount: number;
    }>;
    createNormalTeamMeet(studentId: string, meet: NormalTeamMeetDto): Promise<string>;
    createUrgentTeamMeet(studentId: string, meet: UrgentTeamMeetDto): Promise<string>;
    addTeamDocument(userId: string, name: string, url: string, description: string, typeDocId: string): Promise<void>;
    getTeamDocuments(userId: string): Promise<TeamDocumentEntity[]>;
    deleteTeamDocs(userId: string, docsIds: string[]): Promise<void>;
    updateDocument(userId: string, documentId: string, description: string, name: string, documentTypeId: string): Promise<void>;
    commitDocs(userId: string, title: string, description: string, docsIds: string[]): Promise<void>;
    getTeamsTeacherResponsibleFor(userId: string): Promise<TeamEntity[]>;
    getTeamsTeacherResponsibleForWithMembers(userId: string, promotionId: string): Promise<TeamEntity[]>;
    getTeamCommits(userId: string, teamId: string): Promise<CommitEntity[]>;
    getAllCommitsDocs(userId: string, teamId: string): Promise<CommitDocumentEntity[]>;
    validatedDocument(userId: string, documentIds: string[]): Promise<void>;
    getAllDocsAdmin(userId: string, promotionId: string, teamId: string): Promise<CommitDocumentEntity[]>;
    createSoutenance(userId: string, data: SoutenanceDto): Promise<string>;
    getSoutenance(soutenanceId: string): Promise<SoutenanceEntity>;
    getSoutenances(promotionId: string): Promise<SoutenanceEntity[]>;
    getStudents(): Promise<StudentEntity[]>;
    deleteStudent(studentId: string): Promise<string>;
    editStudent(studentId: string, data: Partial<StudentEntity>): Promise<string>;
    getTeachers(): Promise<TeacherEntity[]>;
    deleteTeacher(teacherId: string): Promise<string>;
    editTeacher(teacherId: string, data: Partial<TeacherEntity>): Promise<string>;
    createThemeSuggestion(userId: string, title: string, description: string, documents: ThemeDocDto[], promotionId: string): Promise<void>;
    getThemeSuggestions(promotionId: string): Promise<ThemeEntity[]>;
    getAllThemeSuggestions(): Promise<ThemeEntity[]>;
    getThemeSuggestion(themeId: string): Promise<ThemeEntity>;
    validateThemeSuggestion(userId: string, themeId: string): Promise<void>;
    getAllThemes(): Promise<ThemeEntity[]>;
    getThemes(promotionId: string): Promise<ThemeEntity[]>;
    getTheme(themeId: string): Promise<ThemeEntity>;
    sendWishList(userId: string, promotionId: string): Promise<import("typeorm").UpdateResult>;
    submitWishList(userId: string, wishList: WishListDTO): Promise<void>;
    encadrerTheme(userId: string, themeId: string, teacherId: string): Promise<void>;
    assignTeamsToTeacher(userId: string, teamIds: string[], teacherId: string): Promise<void>;
    completeTeams(userId: string, promotionId: string): Promise<{
        studentsAddToTeamLater: {
            team: TeamEntity;
            student: StudentEntity;
        }[];
        studentsModifiedTeams: any[];
        studentsToBeInsertedInNewTeam: StudentEntity[];
    }>;
    asignThemesToTeams(userId: string, promotionId: string, method: string): Promise<{
        theme: {
            id: string;
            title: string;
        };
        teams: any;
    }[]>;
    applyThemesToTeamsAssignements(userId: string, data: ThemeToTeamDTO): Promise<any>;
    getTeams(promotionId: string): Promise<{
        id: string;
        pseudo: string;
        theme: ThemeEntity;
        nombre: any;
        promotion: string;
        validated: boolean;
    }[]>;
    getTeam(teamId: any): Promise<{
        id: string;
        pseudo: string;
        theme: ThemeEntity;
        members: StudentEntity[];
        promotion: PromotionEntity;
        validated: boolean;
        teamLeader: StudentEntity;
    }>;
    createNewConfig(key: string, value: string): Promise<void>;
    createNewPromotion(name: string, documentTypes: string[]): Promise<void>;
    getAllPromotions(): Promise<PromotionEntity[]>;
    getPromotionDocumentTypes(userId: string): Promise<DocumentTypeEntity[]>;
    getSalles(): Promise<SalleEntity[]>;
    careateSalle(name: string): Promise<void>;
    getTeamsithThemes(promotionId: string): Promise<{
        id: string;
        pseudo: string;
        theme: ThemeEntity;
        nombre: any;
        promotion: string;
        validated: boolean;
    }[]>;
    canSoutenir(userId: string, teamId: string): Promise<void>;
}
