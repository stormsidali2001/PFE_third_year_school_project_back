import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "src/user/user.service";
import { TeamAnnouncementController } from "./controllers/team.announcement.controller";
import { TeamChatController } from "./controllers/team.chat.controller";
import { TeamInvitationController } from "./controllers/team.invitation.controller";
import { TeamSurveyController } from "./controllers/team.survey.controller";
import { TeamAnnouncementService } from "./services/team.announcement.service";
import { TeamChatService } from "./services/team.chat.service";
import { TeamInvitationService } from "./services/team.invitation.service";
import { TeamSurveyService } from "./services/team.survey.service";


@Module({
    imports:[TypeOrmModule.forFeature([])],
    providers:[TeamInvitationService,TeamSurveyService,TeamAnnouncementService,TeamChatService,UserService],
    controllers:[TeamInvitationController,TeamSurveyController,TeamAnnouncementController,TeamChatController]
})
export class TeamModule {}