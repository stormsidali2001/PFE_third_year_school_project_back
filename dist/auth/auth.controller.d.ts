import { EnterpriseDTO, StudentDTO, TeacherDTO, UserDTO } from "../core/dtos/user.dto";
import { AuthService } from "./auth.service";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signin(data: UserDTO): Promise<{
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
    signupTeacher(data: TeacherDTO): Promise<void>;
    signupStudent(data: StudentDTO): Promise<import("./types/tokens").Tokens>;
    signupEntereprise(data: EnterpriseDTO): Promise<void>;
    forgotpassword(email: string): Promise<string>;
    resetPassword(password: string, token: string, userId: string): Promise<string>;
    refrechToken(userId: string, refrechtoken: string): Promise<import("./types/tokens").Tokens>;
    logout(userId: string): Promise<string>;
}
