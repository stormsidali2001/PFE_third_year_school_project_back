import { TeamAnnoncementDocDto } from "src/core/dtos/user.dto";
import { TeamAnnouncementService } from "../services/team.announcement.service";
export declare class TeamAnnouncementController {
    private readonly teamAnnouncementService;
    constructor(teamAnnouncementService: TeamAnnouncementService);
    getAnnouncements(userId: string): Promise<{
        id: string;
        title: string;
        description: string;
        documents: import("../../core/entities/announcement.document.entity").AnnouncementDocumentEntity[];
    }[]>;
    createTeamAnnouncement(userId: string, title: string, description: string, documents: TeamAnnoncementDocDto[]): Promise<import("../../core/entities/student.entity").StudentEntity>;
}
