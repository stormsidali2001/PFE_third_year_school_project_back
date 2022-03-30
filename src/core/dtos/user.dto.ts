import { Transform } from "class-transformer";
import { isInt, isNumber, IsNumberString } from "class-validator";

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