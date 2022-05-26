import { TeacherEntity } from "./teacher.entity";
import { TeamEntity } from "./team.entity";
export declare class ResponsibleEntity {
    id: string;
    createdAt: Date;
    teacher: TeacherEntity;
    team: TeamEntity;
}
