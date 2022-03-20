import { InvitationEntity } from "./invitation.entity";
import { MeetAbsentEntity } from "./meet.absent.entity";
import { NotificationEntity } from "./Notification.entity";
import { SurveyParticipantEntity } from "./survey.participant.entity";
import { TeamChatMessageEntity } from "./team.chat.message.entity";
import { TeamDocumentEntity } from "./team.document.entity";
import { TeamEntity } from "./team.entity";
import { UserEntity } from "./user.entity";
export declare class StudentEntity {
    id: string;
    code: string;
    firstName: string;
    lastName: string;
    dob: Date;
    team: TeamEntity;
    user: UserEntity;
    sentInvitations: InvitationEntity[];
    receivedInvitations: InvitationEntity[];
    teamChatMessages: TeamChatMessageEntity[];
    documents: TeamDocumentEntity[];
    participationsInSurveys: SurveyParticipantEntity[];
    meetAbsences: MeetAbsentEntity[];
    notifications: NotificationEntity[];
}
