import { UserRepository } from "src/core/repositories/user.repository";
import { EnterpriseDTO, StudentDTO, TeacherDTO, UserDTO, UserRO } from "../core/dtos/user.dto";
import { StudentRepository } from "src/core/repositories/student.repository";
import { RestPasswordTokenRepository } from "src/core/repositories/reset.password.token.repository";
export declare class AuthService {
    private userRepository;
    private studentRepository;
    private resetPasswordTokenRepository;
    constructor(userRepository: UserRepository, studentRepository: StudentRepository, resetPasswordTokenRepository: RestPasswordTokenRepository);
    signin(data: UserDTO): Promise<UserRO>;
    signupStudent(data: StudentDTO): Promise<UserRO>;
    signupTeacher(data: TeacherDTO): Promise<void>;
    signupEnterprise(data: EnterpriseDTO): Promise<void>;
    forgotPassword(email: string): Promise<string>;
    resetPassword(password: string, token: string, userId: string): Promise<string>;
}
