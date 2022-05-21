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
exports.TeamDocumentCommit = void 0;
const typeorm_1 = require("typeorm");
const team_commit_review_entity_1 = require("./team.commit.review.entity");
const team_document_entity_1 = require("./team.document.entity");
const team_entity_1 = require("./team.entity");
let TeamDocumentCommit = class TeamDocumentCommit {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TeamDocumentCommit.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TeamDocumentCommit.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TeamDocumentCommit.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TeamDocumentCommit.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => team_entity_1.TeamEntity, team => team.documentCommits),
    __metadata("design:type", team_entity_1.TeamEntity)
], TeamDocumentCommit.prototype, "team", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => team_document_entity_1.TeamDocumentEntity, teamDocument => teamDocument.teamDocumentCommit),
    __metadata("design:type", Array)
], TeamDocumentCommit.prototype, "documents", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => team_commit_review_entity_1.TeamCommitReviewEntity, teamCommitReviw => teamCommitReviw.teamDocumentCommit),
    __metadata("design:type", Array)
], TeamDocumentCommit.prototype, "reviews", void 0);
TeamDocumentCommit = __decorate([
    (0, typeorm_1.Entity)('team_document_commit')
], TeamDocumentCommit);
exports.TeamDocumentCommit = TeamDocumentCommit;
//# sourceMappingURL=team.document.commit.entity.js.map