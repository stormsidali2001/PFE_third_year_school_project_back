import { TeamDocumentsService } from "../services/team.documents.service";
export declare class TeamDocumentsController {
    private readonly teamDocumentsService;
    constructor(teamDocumentsService: TeamDocumentsService);
    addTeamDocument(userId: string, name: string, url: string, description: string, typeDocId: string): Promise<void>;
    getDocuments(userId: string): Promise<import("../../core/entities/team.document.entity").TeamDocumentEntity[]>;
    deleteTeamDocs(userId: string, docsIds: string[]): Promise<void>;
    updateTeamDocument(userId: string, documentId: string, description: string, name: string, documentTypeId: string): Promise<void>;
    commitDocs(userId: string, title: string, description: string, docsIds: string[]): Promise<void>;
}
