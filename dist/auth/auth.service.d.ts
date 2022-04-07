import { UserRepository } from "src/core/repositories/user.repository";
import { EnterpriseDTO, StudentDTO, TeacherDTO, UserDTO } from "../core/dtos/user.dto";
import { UserType } from "../core/entities/user.entity";
import { StudentRepository } from "src/core/repositories/student.repository";
import { RestPasswordTokenRepository } from "src/core/repositories/reset.password.token.repository";
import { JwtService } from "@nestjs/jwt";
import { Tokens } from "./types/tokens";
export declare class AuthService {
    private userRepository;
    private studentRepository;
    private resetPasswordTokenRepository;
    private jwtService;
    constructor(userRepository: UserRepository, studentRepository: StudentRepository, resetPasswordTokenRepository: RestPasswordTokenRepository, jwtService: JwtService);
    signin(data: UserDTO): Promise<{
        userType: UserType.STUDENT;
        uuid: string;
        email: string;
        firstName: string;
        lastName: string;
        dob: Date;
        code: string;
        studentId: string;
        accesToken: string;
        refrechToken: string;
    }>;
    signupStudent(data: StudentDTO): Promise<Tokens>;
    signupTeacher(data: TeacherDTO): Promise<void>;
    signupEnterprise(data: EnterpriseDTO): Promise<void>;
    forgotPassword(email: string): Promise<string>;
    resetPassword(password: string, token: string, userId: string): Promise<string>;
    refrechToken(userId: string, refrechToken: string): Promise<Tokens>;
    logout(userId: string): Promise<string>;
    _getTokens(userId: string, email: string): Promise<Tokens>;
    _updateRefrechTokenHash(userId: string, refrechToken: string): Promise<void>;
}
