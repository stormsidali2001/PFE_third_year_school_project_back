import { ThemeToTeamDTO } from "src/core/dtos/user.dto";
import { UserService } from "src/user/user.service";
export declare class ThemeAssignementService {
    private readonly userService;
    constructor(userService: UserService);
    asignThemesToTeams(userId: string, promotionId: string, method: string): Promise<{
        theme: {
            id: string;
            title: string;
        };
        teams: any;
    }[]>;
    applyThemesToTeamsAssignements(userId: string, data: ThemeToTeamDTO): Promise<any>;
}
