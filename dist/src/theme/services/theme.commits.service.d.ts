import { CommitDocumentEntity } from "src/core/entities/commit.document.entity";
import { CommitEntity } from "src/core/entities/commit.entity";
export declare class ThemeCommitsService {
    getTeamCommits(userId: string, teamId: string): Promise<CommitEntity[]>;
    getAllCommitsDocs(userId: string, teamId: string): Promise<CommitDocumentEntity[]>;
    validatedDocument(userId: string, documentIds: string[]): Promise<void>;
    getAllDocsAdmin(userId: string, promotionId: string, teamId: string): Promise<CommitDocumentEntity[]>;
}
