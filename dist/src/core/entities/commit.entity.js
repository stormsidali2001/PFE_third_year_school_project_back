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
exports.CommitEntity = void 0;
const typeorm_1 = require("typeorm");
const commit_document_entity_1 = require("./commit.document.entity");
const team_commit_review_entity_1 = require("./team.commit.review.entity");
const team_entity_1 = require("./team.entity");
let CommitEntity = class CommitEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CommitEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CommitEntity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CommitEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CommitEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => team_entity_1.TeamEntity, team => team.commits),
    __metadata("design:type", team_entity_1.TeamEntity)
], CommitEntity.prototype, "team", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => commit_document_entity_1.CommitDocumentEntity, cd => cd.commit),
    __metadata("design:type", Array)
], CommitEntity.prototype, "documents", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => team_commit_review_entity_1.TeamCommitReviewEntity, teamCommitReviw => teamCommitReviw.commit),
    __metadata("design:type", Array)
], CommitEntity.prototype, "reviews", void 0);
CommitEntity = __decorate([
    (0, typeorm_1.Entity)('commit')
], CommitEntity);
exports.CommitEntity = CommitEntity;
//# sourceMappingURL=commit.entity.js.map