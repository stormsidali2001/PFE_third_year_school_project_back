import { Repository } from "typeorm";
import { StudentEntity } from "../entities/student.entity";
export declare class StudentRepository extends Repository<StudentEntity> {
    getTeam(id: string): Promise<StudentEntity>;
    getInvitationList(): Promise<import("typeorm").SelectQueryBuilder<StudentEntity>>;
}
