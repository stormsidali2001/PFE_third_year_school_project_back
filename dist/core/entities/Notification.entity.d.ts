import { AdminEntity } from "./admin.entity";
import { EntrepriseEntity } from "./entreprise.entity";
import { StudentEntity } from "./student.entity";
import { TeacherEntity } from "./teacher.entity";
export declare class NotificationEntity {
    id: string;
    title: string;
    teacher: TeacherEntity;
    student: StudentEntity;
    admin: AdminEntity;
    entreprise: EntrepriseEntity;
}
