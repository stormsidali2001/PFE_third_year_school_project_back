import { UserRO } from "./user.dto";
export declare enum UserType {
    TEACHER = "teacher",
    STUDENT = "student",
    ADMIN = "admin",
    ENTERPRISE = "enterprise"
}
export declare class UserEntity {
    id: String;
    createdAt: Date;
    email: string;
    password: string;
    userType: UserType;
    hashPassword(): Promise<void>;
    toResponseObject(withToken?: Boolean): UserRO;
    comparePassword(password: string): Promise<Boolean>;
    private get token();
}
