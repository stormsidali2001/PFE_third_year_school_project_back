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
exports.StudentEntity = void 0;
const typeorm_1 = require("typeorm");
const invitation_entity_1 = require("./invitation.entity");
const meet_absent_entity_1 = require("./meet.absent.entity");
const survey_participant_entity_1 = require("./survey.participant.entity");
const team_chat_message_entity_1 = require("./team.chat.message.entity");
const team_document_entity_1 = require("./team.document.entity");
const team_entity_1 = require("./team.entity");
const user_entity_1 = require("./user.entity");
let StudentEntity = class StudentEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], StudentEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(''),
    __metadata("design:type", String)
], StudentEntity.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], StudentEntity.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], StudentEntity.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)('date'),
    __metadata("design:type", Date)
], StudentEntity.prototype, "dob", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => team_entity_1.TeamEntity, team => team.students),
    __metadata("design:type", team_entity_1.TeamEntity)
], StudentEntity.prototype, "team", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(type => user_entity_1.UserEntity),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.UserEntity)
], StudentEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => invitation_entity_1.InvitationEntity, invitation => invitation.sender),
    __metadata("design:type", Array)
], StudentEntity.prototype, "sentInvitations", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => invitation_entity_1.InvitationEntity, invitation => invitation.reciever),
    __metadata("design:type", Array)
], StudentEntity.prototype, "receivedInvitations", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => team_chat_message_entity_1.TeamChatMessageEntity, teamChatMessage => teamChatMessage.owner),
    __metadata("design:type", Array)
], StudentEntity.prototype, "teamChatMessages", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => team_document_entity_1.TeamDocumentEntity, teamDocument => teamDocument.owner),
    __metadata("design:type", Array)
], StudentEntity.prototype, "documents", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => survey_participant_entity_1.SurveyParticipantEntity, surveyParticipant => surveyParticipant.student),
    __metadata("design:type", Array)
], StudentEntity.prototype, "participationsInSurveys", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => meet_absent_entity_1.MeetAbsentEntity, meetAbsent => meetAbsent.student),
    __metadata("design:type", Array)
], StudentEntity.prototype, "meetAbsences", void 0);
StudentEntity = __decorate([
    (0, typeorm_1.Entity)('student')
], StudentEntity);
exports.StudentEntity = StudentEntity;
//# sourceMappingURL=student.entity.js.map