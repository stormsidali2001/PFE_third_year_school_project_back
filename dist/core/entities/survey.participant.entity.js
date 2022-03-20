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
exports.SurveyParticipantEntity = void 0;
const typeorm_1 = require("typeorm");
const student_entity_1 = require("./student.entity");
const survey_entity_1 = require("./survey.entity");
let SurveyParticipantEntity = class SurveyParticipantEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SurveyParticipantEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => student_entity_1.StudentEntity, student => student.participationsInSurveys),
    __metadata("design:type", student_entity_1.StudentEntity)
], SurveyParticipantEntity.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => survey_entity_1.SurveyEntity, survey => survey.participants),
    __metadata("design:type", survey_entity_1.SurveyEntity)
], SurveyParticipantEntity.prototype, "survey", void 0);
SurveyParticipantEntity = __decorate([
    (0, typeorm_1.Entity)('survey_participant')
], SurveyParticipantEntity);
exports.SurveyParticipantEntity = SurveyParticipantEntity;
//# sourceMappingURL=survey.participant.entity.js.map