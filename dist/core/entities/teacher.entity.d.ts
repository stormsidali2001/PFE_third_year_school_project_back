import { EncadrementEntity } from "./encadrement.entity";
import { NotificationEntity } from "./Notification.entity";
import { TeamCommitReviewEntity } from "./team.commit.review.entity";
import { TeamTeacherChatMessage } from "./team.teacher.message.entity";
import { ThemeSuggestionEntity } from "./theme.suggestion";
import { UserEntity } from "./user.entity";
export declare class TeacherEntity {
    id: string;
    code: string;
    firstName: string;
    lastName: string;
    dob: Date;
    user: UserEntity;
    teamTeacherChatMessages: TeamTeacherChatMessage[];
    encadrements: EncadrementEntity[];
    commitReviews: TeamCommitReviewEntity[];
    notifications: NotificationEntity[];
    themeSuggestions: ThemeSuggestionEntity[];
}
