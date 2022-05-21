import { TeacherEntity } from "./teacher.entity";
import { TeamDocumentCommit } from "./team.document.commit.entity";
export declare class TeamCommitReviewEntity {
    id: string;
    description: string;
    createdAt: Date;
    teacher: TeacherEntity;
    teamDocumentCommit: TeamDocumentCommit;
}
