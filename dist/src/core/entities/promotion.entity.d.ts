import { StudentEntity } from "./student.entity";
import { TeamEntity } from "./team.entity";
import { ThemeEntity } from "./theme.entity";
export declare class PromotionEntity {
    id: string;
    name: string;
    minTeam: number;
    maxTeam: number;
    teams: TeamEntity[];
    students: StudentEntity[];
    themes: ThemeEntity[];
}
