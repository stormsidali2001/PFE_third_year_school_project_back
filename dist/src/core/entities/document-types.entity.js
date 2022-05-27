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
exports.DocumentTypeEntity = void 0;
const typeorm_1 = require("typeorm");
const commit_document_entity_1 = require("./commit.document.entity");
const promotion_entity_1 = require("./promotion.entity");
const team_document_entity_1 = require("./team.document.entity");
let DocumentTypeEntity = class DocumentTypeEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DocumentTypeEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DocumentTypeEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => promotion_entity_1.PromotionEntity, promotion => promotion.documentTypes),
    __metadata("design:type", promotion_entity_1.PromotionEntity)
], DocumentTypeEntity.prototype, "promotion", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => commit_document_entity_1.CommitDocumentEntity, cmd => cmd.type),
    __metadata("design:type", Array)
], DocumentTypeEntity.prototype, "commitsDocs", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => team_document_entity_1.TeamDocumentEntity, tmd => tmd.type),
    __metadata("design:type", Array)
], DocumentTypeEntity.prototype, "teamDocs", void 0);
DocumentTypeEntity = __decorate([
    (0, typeorm_1.Entity)('document_type')
], DocumentTypeEntity);
exports.DocumentTypeEntity = DocumentTypeEntity;
//# sourceMappingURL=document-types.entity.js.map