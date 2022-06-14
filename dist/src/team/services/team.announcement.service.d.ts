import { TeamAnnoncementDocDto } from "src/core/dtos/user.dto";
import { AnnouncementDocumentEntity } from "src/core/entities/announcement.document.entity";
import { StudentEntity } from "src/core/entities/student.entity";
import { UserService } from "src/user/user.service";
export declare class TeamAnnouncementService {
    private readonly userService;
    constructor(userService: UserService);
    createTeamAnnouncement(userId: string, title: string, description: string, documents: TeamAnnoncementDocDto[]): Promise<StudentEntity>;
    getAnnouncements(userId: string): Promise<{
        id: string;
        title: string;
        description: string;
        documents: AnnouncementDocumentEntity[];
    }[]>;
}
