import { TeacherEntity } from "./teacher.entity";
import { CommitEntity } from "./commit.entity";
export declare class TeamCommitReviewEntity {
    id: string;
    description: string;
    createdAt: Date;
    teacher: TeacherEntity;
    commit: CommitEntity;
}
