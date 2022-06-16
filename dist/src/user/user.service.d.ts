import { WishListDTO } from "src/core/dtos/user.dto";
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
import { DocumentTypeEntity } from "src/core/entities/document-types.entity";
import { SalleEntity } from "src/core/entities/salle.entity";
export declare class UserService {
    private schedulerRegistry;
    private socketService;
    constructor(schedulerRegistry: SchedulerRegistry, socketService: SocketService);
    getUserInfo(userId: string): Promise<{
        [x: string]: string | {
            id: string;
            ssn: string;
            firstName: string;
            speciality: string;
            lastName: string;
            user: UserEntity;
            teamTeacherChatMessages: import("../core/entities/team.teacher.message.entity").TeamTeacherChatMessage[];
            encadrements: import("../core/entities/encadrement.entity").EncadrementEntity[];
            commitReviews: import("../core/entities/team.commit.review.entity").TeamCommitReviewEntity[];
            suggestedThemes: ThemeEntity[];
            teamsInCharge: import("../core/entities/responsible.entity").ResponsibleEntity[];
            soutenances: import("../core/entities/juryOf.entity").Jury_of[];
        } | {
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
    getStudents(): Promise<StudentEntity[]>;
    deleteStudent(studentId: string): Promise<string>;
    editStudent(studentId: string, data: Partial<StudentEntity>): Promise<string>;
    getTeachers(): Promise<TeacherEntity[]>;
    deleteTeacher(teacherId: string): Promise<string>;
    editTeacher(teacherId: string, data: Partial<TeacherEntity>): Promise<string>;
    sendWishList(userId: string, promotionId: string): Promise<import("typeorm").UpdateResult>;
    submitWishList(userId: string, wishList: WishListDTO): Promise<void>;
    getTeams(promotionId: string): Promise<{
        id: string;
        pseudo: string;
        theme: ThemeEntity;
        nombre: any;
        promotion: string;
        validée: boolean;
        peut_soutenir: boolean;
    }[]>;
    getTeam(teamId: any): Promise<{
        id: string;
        pseudo: string;
        theme: ThemeEntity;
        members: StudentEntity[];
        promotion: PromotionEntity;
        validated: boolean;
        teamLeader: StudentEntity;
        peut_soutenir: boolean;
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
}
