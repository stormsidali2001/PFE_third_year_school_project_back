import { Check, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { AdminEntity } from "./admin.entity";
import { EntrepriseEntity } from "./entreprise.entity";
import { StudentEntity } from "./student.entity";
import { TeacherEntity } from "./teacher.entity";
@Check('(teacher IS NULL AND student IS NOT NULL AND admin IS NOT NULL  AND entreprise IS NOT NULL) OR (teacher IS NOT NULL AND student IS  NULL AND admin IS NOT NULL  AND entreprise IS NOT NULL) OR (teacher IS NOT NULL AND student IS NOT NULL AND admin IS  NULL  AND entreprise IS NOT NULL) OR (teacher IS NOT NULL AND student IS NOT NULL AND admin IS NOT NULL  AND entreprise IS  NULL)')
@Entity('notification')
export class NotificationEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    title:string;

    @ManyToOne(type=>TeacherEntity,teacher=>teacher.notifications)
    teacher:TeacherEntity;

    @ManyToOne(type=>StudentEntity,student=>student.notifications)
    student:StudentEntity;

    @ManyToOne(type=>AdminEntity,admin=>admin.notifications)
    admin:AdminEntity;

    @ManyToOne(type=>EntrepriseEntity,entreprise=>entreprise.notifications)
    entreprise:EntrepriseEntity;


}