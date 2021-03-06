import { DocumentTypeEntity } from "./document-types.entity";
import { StudentEntity } from "./student.entity";
import { TeamEntity } from "./team.entity";
import { ThemeEntity } from "./theme.entity";
export declare class PromotionEntity {
    id: string;
    name: string;
    minMembersInTeam: number;
    maxMembersInTeam: number;
    maxTeamForTheme: number;
    minThemesToAssignThemesToTeams: number;
    wishListSent: boolean;
    allTeamsValidated: boolean;
    themesAssignedToTeams: boolean;
    teams: TeamEntity[];
    students: StudentEntity[];
    themes: ThemeEntity[];
    documentTypes: DocumentTypeEntity[];
}
