import { CommitDocumentEntity } from "./commit.document.entity";
import { TeamCommitReviewEntity } from "./team.commit.review.entity";
import { TeamEntity } from "./team.entity";
export declare class CommitEntity {
    id: string;
    title: string;
    description: string;
    createdAt: Date;
    team: TeamEntity;
    documents: CommitDocumentEntity[];
    reviews: TeamCommitReviewEntity[];
}
