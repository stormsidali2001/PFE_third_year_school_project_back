import { ThemeCommitsService } from "../services/theme.commits.service";
export declare class ThemeCommitsController {
    private readonly themeCommitsService;
    constructor(themeCommitsService: ThemeCommitsService);
    getTeamCommits(userId: string, teamId: string): Promise<import("../../core/entities/commit.entity").CommitEntity[]>;
    getAllCommitsDocs(userId: string, teamId: string): Promise<import("../../core/entities/commit.document.entity").CommitDocumentEntity[]>;
    validatedDocument(userId: string, documentIds: string[]): Promise<void>;
    getAllDocsAdmin(userId: string, promotionId: string, teamId: string): Promise<import("../../core/entities/commit.document.entity").CommitDocumentEntity[]>;
}
