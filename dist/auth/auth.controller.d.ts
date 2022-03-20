import { EnterpriseDTO, StudentDTO, TeacherDTO, UserDTO } from "../core/dtos/user.dto";
import { AuthService } from "./auth.service";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signin(data: UserDTO): Promise<import("../core/dtos/user.dto").UserRO>;
    signupTeacher(data: TeacherDTO): Promise<void>;
    signupStudent(data: StudentDTO): Promise<import("../core/dtos/user.dto").UserRO>;
    signupEntereprise(data: EnterpriseDTO): Promise<void>;
    forgotpassword(email: string): Promise<string>;
    resetPassword(password: string, token: string, userId: string): Promise<string>;
}
