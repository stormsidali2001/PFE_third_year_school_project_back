/// <reference types="multer" />
import { StreamableFile } from "@nestjs/common";
import { WishListDTO } from "src/core/dtos/user.dto";
import { UserService } from "./user.service";
import { UserEntity, UserType } from "src/core/entities/user.entity";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getLastNotifications(userId: string, number: number): Promise<{
        notifications: import("../core/entities/Notification.entity").NotificationEntity[];
        totalNotificationCount: number;
    }>;
    uploadFile(file: Express.Multer.File): Promise<{
        originalname: string;
        filename: string;
        destination: string;
    }>;
    downlaodFile(url: string, userId: string): Promise<StreamableFile | "file not found">;
    seeUploadedFile(path: any, res: any): any;
    uploadFiles(files: Express.Multer.File[]): Promise<any[]>;
    getStudents(): Promise<import("../core/entities/student.entity").StudentEntity[]>;
    deleteStudent(studentId: string): Promise<string>;
    editStudent(): Promise<void>;
    getTeachers(): Promise<import("../core/entities/teacher.entity").TeacherEntity[]>;
    deleteTeacher(teacherId: string): Promise<string>;
    editTeacher(): Promise<void>;
    getTeams(promotionId: string): Promise<{
        id: string;
        pseudo: string;
        theme: import("../core/entities/theme.entity").ThemeEntity;
        nombre: any;
        promotion: string;
        complete: boolean;
        peut_soutenir: boolean;
    }[]>;
    getTeam(teamId: string): Promise<{
        id: string;
        pseudo: string;
        theme: import("../core/entities/theme.entity").ThemeEntity;
        members: import("../core/entities/student.entity").StudentEntity[];
        promotion: import("../core/entities/promotion.entity").PromotionEntity;
        validated: boolean;
        teamLeader: import("../core/entities/student.entity").StudentEntity;
        peut_soutenir: boolean;
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
            soutenances: import("../core/entities/juryOf.entity").Jury_of[];
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
    submitWishList(userId: string, data: WishListDTO): Promise<void>;
    getAllPromotions(): Promise<import("../core/entities/promotion.entity").PromotionEntity[]>;
    getPromotionDocumentTypes(userId: any): Promise<import("../core/entities/document-types.entity").DocumentTypeEntity[]>;
    getSalles(): Promise<import("../core/entities/salle.entity").SalleEntity[]>;
    sendNotification(userId: string, description: string): Promise<string>;
    createNewConfig(key: string, value: string): Promise<void>;
    createNewPromotion(name: string, documentTypes: string[]): Promise<void>;
    createSalle(name: string): Promise<void>;
}
