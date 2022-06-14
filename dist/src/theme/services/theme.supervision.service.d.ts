import { TeamEntity } from "src/core/entities/team.entity";
import { ThemeEntity } from "src/core/entities/theme.entity";
export declare class ThemeSupervisionService {
    encadrerTheme(userId: string, themeId: string, teacherId: string): Promise<void>;
    assignTeamsToTeacher(userId: string, teamIds: string[], teacherId: string): Promise<void>;
    getTeamsTeacherResponsibleFor(userId: string): Promise<TeamEntity[]>;
    getTeamsTeacherResponsibleForWithMembers(userId: string, promotionId: string): Promise<TeamEntity[]>;
    getTeamsithThemes(promotionId: string): Promise<{
        id: string;
        pseudo: string;
        theme: ThemeEntity;
        nombre: any;
        promotion: string;
        validated: boolean;
    }[]>;
}
