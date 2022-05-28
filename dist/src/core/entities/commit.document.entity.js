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
exports.CommitDocumentEntity = void 0;
const typeorm_1 = require("typeorm");
const document_data_1 = require("../abstracts/document.data");
const commit_entity_1 = require("./commit.entity");
const document_types_entity_1 = require("./document-types.entity");
const theme_entity_1 = require("./theme.entity");
let CommitDocumentEntity = class CommitDocumentEntity extends document_data_1.DoucmentData {
};
__decorate([
    (0, typeorm_1.Column)({
        default: false
    }),
    __metadata("design:type", Boolean)
], CommitDocumentEntity.prototype, "validated", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => commit_entity_1.CommitEntity, commit => commit.documents),
    __metadata("design:type", theme_entity_1.ThemeEntity)
], CommitDocumentEntity.prototype, "commit", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => document_types_entity_1.DocumentTypeEntity, dt => dt.commitsDocs),
    __metadata("design:type", document_types_entity_1.DocumentTypeEntity)
], CommitDocumentEntity.prototype, "type", void 0);
CommitDocumentEntity = __decorate([
    (0, typeorm_1.Entity)('commit_document')
], CommitDocumentEntity);
exports.CommitDocumentEntity = CommitDocumentEntity;
//# sourceMappingURL=commit.document.entity.js.map