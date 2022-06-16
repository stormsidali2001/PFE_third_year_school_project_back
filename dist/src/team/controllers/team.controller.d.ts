import { ApplyTeamsCompletionDTO } from "src/core/dtos/user.dto";
import { TeamService } from "../services/team.service";
export declare class TeamController {
    private readonly teamService;
    constructor(teamService: TeamService);
    getTeamsStats(userId: string, promotionId: string): Promise<import("../../core/entities/promotion.entity").PromotionEntity>;
    completeTeams(userId: any, promotionId: string): Promise<{
        INITIAL_EXTRA_STUDENTS: import("../../core/entities/student.entity").StudentEntity[];
        studentAdded: {
            student: import("../../core/entities/student.entity").StudentEntity;
            team: import("../../core/entities/team.entity").TeamEntity;
        }[];
        studentDeleted: {
            student: import("../../core/entities/student.entity").StudentEntity;
            team: import("../../core/entities/team.entity").TeamEntity;
        }[];
        newTeams: import("../../core/entities/team.entity").TeamEntity[];
    }>;
    applyTeamsCompletion(userId: string, promotionId: string, applyTeamsCompletionPayload: ApplyTeamsCompletionDTO): Promise<string>;
}
