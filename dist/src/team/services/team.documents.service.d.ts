import { TeamDocumentEntity } from "src/core/entities/team.document.entity";
import { SocketService } from "src/socket/socket.service";
import { UserService } from "src/user/user.service";
export declare class TeamDocumentsService {
    private readonly userService;
    private socketService;
    constructor(userService: UserService, socketService: SocketService);
    addTeamDocument(userId: string, name: string, url: string, description: string, typeDocId: string): Promise<void>;
    getTeamDocuments(userId: string): Promise<TeamDocumentEntity[]>;
    deleteTeamDocs(userId: string, docsIds: string[]): Promise<void>;
    updateTeamDocument(userId: string, documentId: string, description: string, name: string, documentTypeId: string): Promise<void>;
    commitDocs(userId: string, title: string, description: string, docsIds: string[]): Promise<void>;
}
