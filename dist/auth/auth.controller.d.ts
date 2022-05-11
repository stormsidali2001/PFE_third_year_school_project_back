import { AdminDto, EnterpriseDTO, StudentDTO, StudentTestDTO, TeacherDTO } from "../core/dtos/user.dto";
import { AuthService } from "./auth.service";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signin(req: any): Promise<any>;
    signupTeacher(data: TeacherDTO): Promise<void>;
    signupStudent(data: StudentDTO): Promise<void>;
    signupStudents(data: StudentDTO[]): Promise<any[]>;
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
    getUser(request: any): Promise<any>;
    signupStudentTest(data: StudentTestDTO): Promise<void>;
}
