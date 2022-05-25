import { TeamCommitReviewEntity } from "./team.commit.review.entity";
import { TeamEntity } from "./team.entity";
export declare class TeamDocumentCommit {
    id: string;
    title: string;
    description: string;
    createdAt: Date;
    team: TeamEntity;
    documents: TeamDocumentCommit[];
    reviews: TeamCommitReviewEntity[];
}
