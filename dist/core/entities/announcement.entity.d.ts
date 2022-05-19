import { AnnouncementDocumentEntity } from "./announcement.document.entity";
import { TeamEntity } from "./team.entity";
export declare class AnnouncementEntity {
    id: string;
    title: string;
    description: string;
    createdAt: Date;
    documents: AnnouncementDocumentEntity[];
    team: TeamEntity;
}
