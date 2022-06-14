import { ThemeToTeamDTO } from "src/core/dtos/user.dto";
import { ThemeAssignementService } from "../services/theme.assignement.service";
export declare class ThemeAssignementController {
    private readonly themeAssignementService;
    constructor(themeAssignementService: ThemeAssignementService);
    asignThemesToTeams(userId: string, promotionId: string, method: string): Promise<{
        theme: {
            id: string;
            title: string;
        };
        teams: any;
    }[]>;
    applyThemesToTeamsAssignements(userId: string, data: ThemeToTeamDTO): Promise<any>;
}
