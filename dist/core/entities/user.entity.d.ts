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
    email: string;
    password: string;
    userType: UserType;
    refrechTokenHash: string;
    tokens: RestPasswordTokenEntity[];
}
