import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "src/user/user.service";
import { TeamInvitationController } from "./controllers/team.invitation.controller";
import { TeamSurveyController } from "./controllers/team.survey.controller";
import { TeamInvitationService } from "./services/team.invitation.service";
import { TeamSurveyService } from "./services/team.survey.service";


@Module({
    imports:[TypeOrmModule.forFeature([])],
    providers:[TeamInvitationService,TeamSurveyService,UserService],
    controllers:[TeamInvitationController,TeamSurveyController]
})
export class TeamModule {}