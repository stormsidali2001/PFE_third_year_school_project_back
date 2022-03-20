import { StudentEntity } from "./student.entity";
export declare class InvitationEntity {
    id: string;
    description: string;
    accepted: boolean;
    sender: StudentEntity;
    reciever: StudentEntity;
}
