export declare class UserDTO {
    email: string;
    password: string;
}
export declare class UserRO {
    id: string;
    createdAt: Date;
    token?: string;
    email: string;
}
export declare class TeacherDTO {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    code: string;
    dob: Date;
}
export declare class StudentDTO {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    code: string;
    dob: Date;
}
export declare class EnterpriseDTO {
    email: string;
    password: string;
    name: string;
}
