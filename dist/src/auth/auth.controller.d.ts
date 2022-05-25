import { AdminDto, EnterpriseDTO, StudentDTO, StudentTestDTO, TeacherDTO, TeacherTestDTO } from "../core/dtos/user.dto";
import { AuthService } from "./auth.service";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signin(req: any): Promise<any>;
    signupTeacher(userId: string, data: TeacherDTO): Promise<void>;
    signupTeachers(userId: string, data: TeacherDTO[]): Promise<any[]>;
    signupStudent(userId: string, data: StudentDTO): Promise<void>;
    signupStudents(userId: string, data: StudentDTO[]): Promise<any[]>;
    signupEntereprise(data: EnterpriseDTO): Promise<void>;
    forgotpassword(email: string): Promise<string>;
    resetPassword(password: string, token: string, userId: string): Promise<string>;
    logout(request: any): Promise<string>;
    signupAdmin(admin: AdminDto): Promise<{
        user: import("../core/entities/user.entity").UserEntity;
        id: String;
        firstName: String;
        lastName: String;
    }>;
    signupStudentTest(data: StudentTestDTO): Promise<void>;
    signupTeacherTest(data: TeacherTestDTO): Promise<void>;
}
