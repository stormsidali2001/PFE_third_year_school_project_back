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
exports.SurveyEntity = void 0;
const typeorm_1 = require("typeorm");
const survey_option_entity_1 = require("./survey.option.entity");
const survey_participant_entity_1 = require("./survey.participant.entity");
const team_entity_1 = require("./team.entity");
let SurveyEntity = class SurveyEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SurveyEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SurveyEntity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SurveyEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SurveyEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SurveyEntity.prototype, "period", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], SurveyEntity.prototype, "close", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => team_entity_1.TeamEntity, team => team.surveys),
    __metadata("design:type", team_entity_1.TeamEntity)
], SurveyEntity.prototype, "team", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => survey_option_entity_1.SurveyOptionEntity, surveyOption => surveyOption.survey),
    __metadata("design:type", Array)
], SurveyEntity.prototype, "options", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => survey_participant_entity_1.SurveyParticipantEntity, surveyParticipant => surveyParticipant.survey),
    __metadata("design:type", Array)
], SurveyEntity.prototype, "participants", void 0);
SurveyEntity = __decorate([
    (0, typeorm_1.Entity)('survey')
], SurveyEntity);
exports.SurveyEntity = SurveyEntity;
//# sourceMappingURL=survey.entity.js.map