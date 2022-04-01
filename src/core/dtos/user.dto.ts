import { Transform } from "class-transformer";
import { isInt, isNumber, IsNumberString } from "class-validator";
import { MeetType } from "../entities/meet.entity";

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
    email:string;
    password:string;
    firstName:string;
    lastName:string;
    code:string;
    dob:Date;
}

export class StudentDTO{
    email:string;
    password:string;
    firstName:string;
    lastName:string;
    code:string;
    dob:Date;
}
export class EnterpriseDTO{
    email:string;
    password:string;
    name:string;
  
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