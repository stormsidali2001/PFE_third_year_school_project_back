"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamEntity = void 0;
const typeorm_1 = require("typeorm");
const announcement_entity_1 = require("./announcement.entity");
const meet_entity_1 = require("./meet.entity");
const modification_action_entity_1 = require("./modification.action.entity");
const promotion_entity_1 = require("./promotion.entity");
const student_entity_1 = require("./student.entity");
const survey_entity_1 = require("./survey.entity");
const team_chat_message_entity_1 = require("./team.chat.message.entity");
const team_document_commit_entity_1 = require("./team.document.commit.entity");
const team_document_entity_1 = require("./team.document.entity");
const theme_entity_1 = require("./theme.entity");
const wish_entity_1 = require("./wish.entity");
let TeamEntity = class TeamEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TeamEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TeamEntity.prototype, "nickName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: ''
    }),
    __metadata("design:type", String)
], TeamEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: ''
    }),
    __metadata("design:type", String)
], TeamEntity.prototype, "rules", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => student_entity_1.StudentEntity, student => student.team),
    __metadata("design:type", Array)
], TeamEntity.prototype, "students", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(type => student_entity_1.StudentEntity),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", student_entity_1.StudentEntity)
], TeamEntity.prototype, "teamLeader", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(type => student_entity_1.StudentEntity),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", student_entity_1.StudentEntity)
], TeamEntity.prototype, "qualityManager", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => team_chat_message_entity_1.TeamChatMessageEntity, teamChatMessage => teamChatMessage.message),
    __metadata("design:type", Array)
], TeamEntity.prototype, "teamMessages", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => survey_entity_1.SurveyEntity, survey => survey.team),
    __metadata("design:type", Array)
], TeamEntity.prototype, "surveys", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => announcement_entity_1.AnnouncementEntity, announcement => announcement.team),
    __metadata("design:type", Array)
], TeamEntity.prototype, "announcements", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => team_document_entity_1.TeamDocumentEntity, teamDocument => teamDocument.team),
    __metadata("design:type", Array)
], TeamEntity.prototype, "documents", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => modification_action_entity_1.ModificationActionEntity, modificationAction => modificationAction.team),
    __metadata("design:type", Array)
], TeamEntity.prototype, "modificationActions", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => theme_entity_1.ThemeEntity, theme => theme.teams),
    __metadata("design:type", theme_entity_1.ThemeEntity)
], TeamEntity.prototype, "givenTheme", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => meet_entity_1.MeetEntity, meet => meet.team),
    __metadata("design:type", Array)
], TeamEntity.prototype, "meets", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => team_document_commit_entity_1.TeamDocumentCommit, teamDocumentCommit => teamDocumentCommit.team),
    __metadata("design:type", Array)
], TeamEntity.prototype, "documentCommits", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => promotion_entity_1.PromotionEntity, promotion => promotion.teams),
    __metadata("design:type", promotion_entity_1.PromotionEntity)
], TeamEntity.prototype, "promotion", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => wish_entity_1.WishEntity, wish => wish.team),
    __metadata("design:type", Array)
], TeamEntity.prototype, "wishes", void 0);
TeamEntity = __decorate([
    (0, typeorm_1.Entity)('team')
], TeamEntity);
exports.TeamEntity = TeamEntity;
//# sourceMappingURL=team.entity.js.map