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
    period:number;
    teamId:string;
    close:boolean;
}
export class OptionsDto{
    description:string;
}