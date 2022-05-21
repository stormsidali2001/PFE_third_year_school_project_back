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
exports.TeamCommitReviewEntity = void 0;
const typeorm_1 = require("typeorm");
const teacher_entity_1 = require("./teacher.entity");
const team_document_commit_entity_1 = require("./team.document.commit.entity");
let TeamCommitReviewEntity = class TeamCommitReviewEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TeamCommitReviewEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TeamCommitReviewEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TeamCommitReviewEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => teacher_entity_1.TeacherEntity, teacher => teacher.commitReviews),
    __metadata("design:type", teacher_entity_1.TeacherEntity)
], TeamCommitReviewEntity.prototype, "teacher", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => team_document_commit_entity_1.TeamDocumentCommit, teamDocumentCommit => teamDocumentCommit.reviews),
    __metadata("design:type", team_document_commit_entity_1.TeamDocumentCommit)
], TeamCommitReviewEntity.prototype, "teamDocumentCommit", void 0);
TeamCommitReviewEntity = __decorate([
    (0, typeorm_1.Entity)('team_commit_review')
], TeamCommitReviewEntity);
exports.TeamCommitReviewEntity = TeamCommitReviewEntity;
//# sourceMappingURL=team.commit.review.entity.js.map