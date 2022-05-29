import { SoutenanceEntity } from "./soutenance.entity";
import { TeacherEntity } from "./teacher.entity";
export declare class Jury_of {
    id: string;
    createdAt: Date;
    soutenance: SoutenanceEntity;
    teacher: TeacherEntity;
}
