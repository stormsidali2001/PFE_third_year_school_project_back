import { ThemeToTeamDTO } from "src/core/dtos/user.dto";
export declare class ThemeAssignementService {
    asignThemesToTeams(userId: string, promotionId: string, method: string): Promise<{
        theme: {
            id: string;
            title: string;
        };
        teams: any;
    }[]>;
    applyThemesToTeamsAssignements(userId: string, data: ThemeToTeamDTO): Promise<any>;
}
