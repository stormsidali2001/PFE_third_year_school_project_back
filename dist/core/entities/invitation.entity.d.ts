import { StudentEntity } from "./student.entity";
export declare class InvitationEntity {
    id: string;
    description: string;
    sender: StudentEntity;
    reciever: StudentEntity;
}
