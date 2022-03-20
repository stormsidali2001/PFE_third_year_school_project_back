import { AnnouncementEntity } from "./announcement.entity";
import { MeetEntity } from "./meet.entity";
import { ModificationActionEntity } from "./modification.action.entity";
import { StudentEntity } from "./student.entity";
import { SurveyEntity } from "./survey.entity";
import { TeamChatMessageEntity } from "./team.chat.message.entity";
import { TeamDocumentCommit } from "./team.document.commit.entity";
import { TeamDocumentEntity } from "./team.document.entity";
import { ThemeEntity } from "./theme.entity";
import { ThemeSuggestionEntity } from "./theme.suggestion";
export declare class TeamEntity {
    id: string;
    nickName: string;
    description: string;
    rules: string;
    students: StudentEntity[];
    teamLeader: StudentEntity;
    qualityManager: StudentEntity;
    teamMessages: TeamChatMessageEntity[];
    surveys: SurveyEntity[];
    announcements: AnnouncementEntity[];
    documents: TeamDocumentEntity[];
    modificationActions: ModificationActionEntity[];
    givenTheme: ThemeEntity;
    meets: MeetEntity[];
    documentCommits: TeamDocumentCommit[];
    themeSuggestions: ThemeSuggestionEntity[];
}
