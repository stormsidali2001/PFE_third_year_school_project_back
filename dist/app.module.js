"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./core/entities/user.entity");
const config_1 = require("@nestjs/config");
const student_entity_1 = require("./core/entities/student.entity");
const teacher_entity_1 = require("./core/entities/teacher.entity");
const team_entity_1 = require("./core/entities/team.entity");
const entreprise_entity_1 = require("./core/entities/entreprise.entity");
const admin_entity_1 = require("./core/entities/admin.entity");
const invitation_entity_1 = require("./core/entities/invitation.entity");
const team_chat_message_entity_1 = require("./core/entities/team.chat.message.entity");
const team_teacher_message_entity_1 = require("./core/entities/team.teacher.message.entity");
const survey_entity_1 = require("./core/entities/survey.entity");
const survey_option_entity_1 = require("./core/entities/survey.option.entity");
const announcement_document_entity_1 = require("./core/entities/announcement.document.entity");
const announcement_entity_1 = require("./core/entities/announcement.entity");
const modification_action_entity_1 = require("./core/entities/modification.action.entity");
const evaluation_entity_1 = require("./core/entities/evaluation.entity");
const team_document_entity_1 = require("./core/entities/team.document.entity");
const theme_entity_1 = require("./core/entities/theme.entity");
const theme_document_entity_1 = require("./core/entities/theme.document.entity");
const encadrement_entity_1 = require("./core/entities/encadrement.entity");
const meet_entity_1 = require("./core/entities/meet.entity");
const survey_participant_entity_1 = require("./core/entities/survey.participant.entity");
const pv_meet_entity_1 = require("./core/entities/pv.meet.entity");
const pv_meet_task_todo_entity_1 = require("./core/entities/pv.meet.task.todo.entity");
const meet_absent_entity_1 = require("./core/entities/meet.absent.entity");
const team_document_commit_entity_1 = require("./core/entities/team.document.commit.entity");
const team_commit_review_entity_1 = require("./core/entities/team.commit.review.entity");
const Notification_entity_1 = require("./core/entities/Notification.entity");
const pv_meet_descused_point_entity_1 = require("./core/entities/pv.meet.descused.point.entity");
const theme_suggestion_1 = require("./core/entities/theme.suggestion");
const theme_suggestion_document_entity_1 = require("./core/entities/theme.suggestion.document.entity");
const resetPasswordToken_entity_1 = require("./core/entities/resetPasswordToken.entity");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forRoot({
                type: "mysql",
                host: "localhost",
                port: 1000,
                database: "pfe_db",
                username: "root",
                password: "root",
                synchronize: true,
                logging: true,
                entities: [user_entity_1.UserEntity,
                    student_entity_1.StudentEntity,
                    team_entity_1.TeamEntity,
                    entreprise_entity_1.EntrepriseEntity,
                    teacher_entity_1.TeacherEntity,
                    admin_entity_1.AdminEntity,
                    invitation_entity_1.InvitationEntity,
                    team_chat_message_entity_1.TeamChatMessageEntity,
                    team_teacher_message_entity_1.TeamTeacherChatMessage,
                    survey_entity_1.SurveyEntity,
                    survey_option_entity_1.SurveyOptionEntity,
                    announcement_document_entity_1.AnnouncementDocumentEntity,
                    announcement_entity_1.AnnouncementEntity,
                    modification_action_entity_1.ModificationActionEntity,
                    evaluation_entity_1.EvaluationEntity,
                    team_document_entity_1.TeamDocumentEntity,
                    theme_entity_1.ThemeEntity,
                    theme_document_entity_1.ThemeDocumentEntity,
                    encadrement_entity_1.EncadrementEntity,
                    survey_participant_entity_1.SurveyParticipantEntity,
                    pv_meet_entity_1.PvMeetEntity,
                    meet_entity_1.MeetEntity,
                    pv_meet_task_todo_entity_1.TaskTodoPvMeetEntity,
                    pv_meet_descused_point_entity_1.DiscusedPointEntity,
                    meet_absent_entity_1.MeetAbsentEntity,
                    team_document_commit_entity_1.TeamDocumentCommit,
                    team_document_entity_1.TeamDocumentEntity,
                    team_commit_review_entity_1.TeamCommitReviewEntity,
                    Notification_entity_1.NotificationEntity,
                    theme_suggestion_1.ThemeSuggestionEntity,
                    theme_suggestion_document_entity_1.ThemeSuggestionDocumentEntity,
                    resetPasswordToken_entity_1.RestPasswordTokenEntity
                ]
            }), auth_module_1.Auth, config_1.ConfigModule.forRoot({ isGlobal: true })],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map