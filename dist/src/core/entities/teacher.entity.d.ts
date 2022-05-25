import { EncadrementEntity } from "./encadrement.entity";
import { TeamCommitReviewEntity } from "./team.commit.review.entity";
import { TeamTeacherChatMessage } from "./team.teacher.message.entity";
import { ThemeEntity } from "./theme.entity";
import { UserEntity } from "./user.entity";
export declare class TeacherEntity {
    id: string;
    ssn: string;
    firstName: string;
    speciality: string;
    lastName: string;
    user: UserEntity;
    teamTeacherChatMessages: TeamTeacherChatMessage[];
    encadrements: EncadrementEntity[];
    commitReviews: TeamCommitReviewEntity[];
    suggestedThemes: ThemeEntity[];
}
