import { StudentEntity } from "./student.entity";
import { TeamEntity } from "./team.entity";
import { ThemeEntity } from "./theme.entity";
export declare class PromotionEntity {
    id: string;
    name: string;
    minMembersInTeam: number;
    maxMembersInTeam: number;
    minTeam: number;
    maxTeam: number;
    wishListSent: boolean;
    teams: TeamEntity[];
    students: StudentEntity[];
    themes: ThemeEntity[];
}
