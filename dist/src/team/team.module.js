"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_service_1 = require("../user/user.service");
const team_announcement_controller_1 = require("./controllers/team.announcement.controller");
const team_invitation_controller_1 = require("./controllers/team.invitation.controller");
const team_survey_controller_1 = require("./controllers/team.survey.controller");
const team_announcement_service_1 = require("./services/team.announcement.service");
const team_invitation_service_1 = require("./services/team.invitation.service");
const team_survey_service_1 = require("./services/team.survey.service");
let TeamModule = class TeamModule {
};
TeamModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([])],
        providers: [team_invitation_service_1.TeamInvitationService, team_survey_service_1.TeamSurveyService, team_announcement_service_1.TeamAnnouncementService, user_service_1.UserService],
        controllers: [team_invitation_controller_1.TeamInvitationController, team_survey_controller_1.TeamSurveyController, team_announcement_controller_1.TeamAnnouncementController]
    })
], TeamModule);
exports.TeamModule = TeamModule;
//# sourceMappingURL=team.module.js.map