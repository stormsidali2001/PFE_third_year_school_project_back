import { NotificationEntity } from "./Notification.entity";
import { RestPasswordTokenEntity } from "./resetPasswordToken.entity";
export declare enum UserType {
    TEACHER = "teacher",
    STUDENT = "student",
    ADMIN = "admin",
    ENTERPRISE = "enterprise"
}
export declare class UserEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    password: string;
    userType: UserType;
    refrechTokenHash: string;
    tokens: RestPasswordTokenEntity[];
    notifications: NotificationEntity[];
}
