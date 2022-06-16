import { ApplyTeamsCompletionDTO } from "src/core/dtos/user.dto";
import { PromotionEntity } from "src/core/entities/promotion.entity";
import { StudentEntity } from "src/core/entities/student.entity";
import { TeamEntity } from "src/core/entities/team.entity";
export declare class TeamService {
    getTeamsStats(userId: string, promotionId: string): Promise<PromotionEntity>;
    completeTeams(userId: string, promotionId: string): Promise<{
        INITIAL_EXTRA_STUDENTS: StudentEntity[];
        studentAdded: {
            student: StudentEntity;
            team: TeamEntity;
        }[];
        studentDeleted: {
            student: StudentEntity;
            team: TeamEntity;
        }[];
        newTeams: TeamEntity[];
    }>;
    applyTeamsCompletion(userId: string, promotionId: string, applyTeamsCompletionPayload: ApplyTeamsCompletionDTO): Promise<string>;
}
