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
exports.TeacherEntity = void 0;
const typeorm_1 = require("typeorm");
const encadrement_entity_1 = require("./encadrement.entity");
const team_commit_review_entity_1 = require("./team.commit.review.entity");
const team_teacher_message_entity_1 = require("./team.teacher.message.entity");
const theme_suggestion_1 = require("./theme.suggestion");
const user_entity_1 = require("./user.entity");
let TeacherEntity = class TeacherEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TeacherEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], TeacherEntity.prototype, "ssn", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TeacherEntity.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TeacherEntity.prototype, "speciality", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TeacherEntity.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(type => user_entity_1.UserEntity),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.UserEntity)
], TeacherEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => team_teacher_message_entity_1.TeamTeacherChatMessage, teamChatMessage => teamChatMessage.ownerT),
    __metadata("design:type", Array)
], TeacherEntity.prototype, "teamTeacherChatMessages", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => encadrement_entity_1.EncadrementEntity, encadrement => encadrement.teacher),
    __metadata("design:type", Array)
], TeacherEntity.prototype, "encadrements", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => team_commit_review_entity_1.TeamCommitReviewEntity, teamCommitReview => teamCommitReview.teacher),
    __metadata("design:type", Array)
], TeacherEntity.prototype, "commitReviews", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => theme_suggestion_1.ThemeSuggestionEntity, themeSuggestion => themeSuggestion.teacher),
    __metadata("design:type", Array)
], TeacherEntity.prototype, "themeSuggestions", void 0);
TeacherEntity = __decorate([
    (0, typeorm_1.Entity)('teacher')
], TeacherEntity);
exports.TeacherEntity = TeacherEntity;
//# sourceMappingURL=teacher.entity.js.map