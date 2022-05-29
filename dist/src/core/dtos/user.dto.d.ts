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
    ssn: string;
    email: string;
    firstName: string;
    lastName: string;
    speciality: string;
}
export declare class TeacherTestDTO {
    ssn: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    speciality: string;
}
export declare class StudentDTO {
    email: string;
    firstName: string;
    lastName: string;
    moy: number;
    code: string;
    dob: Date;
    promotionId: string;
}
export declare class StudentTestDTO {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    moy: number;
    code: string;
    dob: Date;
    promotionId: string;
}
export declare class EnterpriseDTO {
    email: string;
    name: string;
}
export declare class EnterpriseTestDTO {
    email: string;
    password: string;
    name: string;
}
export declare class AdminDto {
    firstName: string;
    lastName: string;
    password: string;
    email: string;
}
export declare class SurveyDto {
    title: string;
    description: string;
    options: OptionsDto[];
    period: number;
    teamId: string;
}
export declare class OptionsDto {
    description: string;
}
export declare class NormalTeamMeetDto {
    title: string;
    description: string;
    weekDay: number;
    hour: number;
    minute: number;
    second: number;
}
export declare class UrgentTeamMeetDto {
    title: string;
    description: string;
    date: Date;
}
export declare class TeamAnnoncementDocDto {
    url: string;
    name: string;
}
export declare class ThemeDocDto {
    url: string;
    name: string;
}
export declare class Wish {
    order: number;
    themeId: string;
}
export declare class WishListDTO {
    wishes: Wish[];
}
declare class ThemeToTeamEntry {
    idTheme: string;
    teamIds: string[];
}
export declare class ThemeToTeamDTO {
    themeToTeam: ThemeToTeamEntry[];
}
export declare class SoutenanceDto {
    teamId: string;
    title: string;
    description: string;
    date: Date;
    jurysIds: string[];
    salleId: string;
    duration: number;
}
export {};
