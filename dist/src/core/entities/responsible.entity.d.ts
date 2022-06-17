import { TeacherEntity } from "./teacher.entity";
import { TeamEntity } from "./team.entity";
import { ThemeEntity } from "./theme.entity";
export declare class ResponsibleEntity {
    id: string;
    createdAt: Date;
    teacher: TeacherEntity;
    team: TeamEntity;
    theme: ThemeEntity;
}
