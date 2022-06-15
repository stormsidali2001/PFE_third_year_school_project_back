import { ThemeSupervisionService } from "../services/theme.supervision.service";
export declare class ThemeSupervisionController {
    private readonly themeSupervisionService;
    constructor(themeSupervisionService: ThemeSupervisionService);
    encadrerTheme(userId: string, themeId: string, teacherId: string): Promise<void>;
    assignTeamsToTeacher(userId: string, teamIds: string[], teacherId: string): Promise<void>;
    getTeamsTeacherResponsibleFor(userId: string): Promise<import("../../core/entities/team.entity").TeamEntity[]>;
    getTeamsTeacherResponsibleForWithMembers(userId: string, promotionId: string): Promise<import("../../core/entities/team.entity").TeamEntity[]>;
    getTeamsithThemes(promotionId: string): Promise<{
        id: string;
        pseudo: string;
        theme: import("../../core/entities/theme.entity").ThemeEntity;
        nombre: any;
        promotion: string;
        validated: boolean;
    }[]>;
    canSoutenir(userId: string, teamId: string): Promise<void>;
}
