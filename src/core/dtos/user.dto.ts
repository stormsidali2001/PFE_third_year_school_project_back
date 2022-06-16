import { Transform } from "class-transformer";
import { isInt, isNumber, IsNumberString } from "class-validator";
import { MeetType } from "../entities/meet.entity";
import { StudentEntity } from "../entities/student.entity";

export class UserDTO{
    email:string;
    password:string;
}

export class UserRO{
    id:string;
    createdAt:Date;
    token?:string;
    email:string;
}

export class TeacherDTO{
    ssn:string;
    email:string;
    firstName:string;
    lastName:string;
    speciality:string;
}
export class TeacherTestDTO{
    ssn:string;
    email:string;
    password:string;
    firstName:string;
    lastName:string;
    speciality:string;
}

export class StudentDTO{
    email:string;
    firstName:string;
    lastName:string;
    moy:number;
    code:string;
    dob:Date;
    promotionId:string;

}
export class StudentTestDTO{
    email:string;
    password:string;
    firstName:string;
    lastName:string;
    moy:number;
    code:string;
    dob:Date;
    promotionId:string;
}
export class EnterpriseDTO{
    email:string;
    name:string;
  
}
export class EnterpriseTestDTO{
    email:string;
    password:string;
    name:string;
  
}
export class AdminDto{
    firstName:string;
    lastName:string;
    password:string;
    email:string;
}

export class SurveyDto{
    title:string;
    description:string;
    options:OptionsDto[];
    @Transform(({value}) => parseInt(value),{toClassOnly:true})
    period:number;
    teamId:string;
}
export class OptionsDto{
    description:string;
}

export class NormalTeamMeetDto{
    title:string;
    description:string;
    @Transform(({value}) => parseInt(value),{toClassOnly:true})
    weekDay:number;
    @Transform(({value}) => parseInt(value),{toClassOnly:true})
    hour:number;
    @Transform(({value}) => parseInt(value),{toClassOnly:true})
    minute:number;
    @Transform(({value}) => {parseInt(value)},{toClassOnly:true})
    second:number;
}

export class UrgentTeamMeetDto{
    title:string;
    description:string;
    date:Date;
}

export class TeamAnnoncementDocDto{
    url:string;
    name:string;
}

export class ThemeDocDto{
    url:string;
    name:string;

}
export class Wish{
    order:number;
    themeId:string;
}
export class WishListDTO{
    wishes:Wish[];
}


class ThemeToTeamEntry {
   idTheme:string;
   teamIds:string[]
}
export class ThemeToTeamDTO{
    themeToTeam:ThemeToTeamEntry[]
}

export class SoutenanceDto{
    teamId:string;
    title:string;
    description:string;
    date:Date;
    jurysIds:string[];
    salleId:string;
    duration:number;
 
}
export class ApplyTeamsCompletionDTO{
    addedStudents:{studentId:string,teamId:string}[];
    deletedStudents:{studentId:string,teamId:string}[];
    newTeams:{students:{studentId:string}}[];
}