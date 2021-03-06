import { UserRepository } from "src/core/repositories/user.repository";
import { AdminDto, EnterpriseDTO, StudentDTO, StudentTestDTO, TeacherDTO, TeacherTestDTO, UserDTO } from "../core/dtos/user.dto";
import { UserEntity } from "../core/entities/user.entity";
import { StudentRepository } from "src/core/repositories/student.repository";
import { RestPasswordTokenRepository } from "src/core/repositories/reset.password.token.repository";
import { JwtService } from "@nestjs/jwt";
import { SocketService } from "src/socket/socket.service";
import { UserService } from "src/user/user.service";
export declare class AuthService {
    private userRepository;
    private studentRepository;
    private resetPasswordTokenRepository;
    private jwtService;
    private socketService;
    private userService;
    constructor(userRepository: UserRepository, studentRepository: StudentRepository, resetPasswordTokenRepository: RestPasswordTokenRepository, jwtService: JwtService, socketService: SocketService, userService: UserService);
    signin(data: UserDTO): Promise<{
        id: string;
    }>;
    signupStudent(userId: string, data: StudentDTO): Promise<void>;
    signupStudents(userId: string, data: StudentDTO[]): Promise<any[]>;
    signupTeacher(userId: string, data: TeacherDTO): Promise<void>;
    signupTeachers(userId: any, data: TeacherDTO[]): Promise<any[]>;
    signupEnterprise(data: EnterpriseDTO): Promise<void>;
    signupAdmin(admin: AdminDto): Promise<{
        user: UserEntity;
        id: String;
        firstName: String;
        lastName: String;
    }>;
    forgotPassword(email: string): Promise<string>;
    resetPassword(password: string, token: string, userId: string): Promise<string>;
    signupStudentTest(data: StudentTestDTO): Promise<void>;
    signupTeacherTest(data: TeacherTestDTO): Promise<void>;
}
