import { EnterpriseDTO, StudentDTO, TeacherDTO } from "../core/dtos/user.dto";
import { AuthService } from "./auth.service";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signin(req: any): Promise<any>;
    signupTeacher(data: TeacherDTO): Promise<void>;
    signupStudent(data: StudentDTO): Promise<import("./types/tokens").Tokens>;
    signupEntereprise(data: EnterpriseDTO): Promise<void>;
    forgotpassword(email: string): Promise<string>;
    resetPassword(password: string, token: string, userId: string): Promise<string>;
    logout(request: any): Promise<string>;
    getUser(request: any): Promise<any>;
}
