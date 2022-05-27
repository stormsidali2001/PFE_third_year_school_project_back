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
exports.TeamDocumentEntity = void 0;
const typeorm_1 = require("typeorm");
const document_data_1 = require("../abstracts/document.data");
const document_types_entity_1 = require("./document-types.entity");
const evaluation_entity_1 = require("./evaluation.entity");
const modification_action_entity_1 = require("./modification.action.entity");
const student_entity_1 = require("./student.entity");
const team_entity_1 = require("./team.entity");
let TeamDocumentEntity = class TeamDocumentEntity extends document_data_1.DoucmentData {
};
__decorate([
    (0, typeorm_1.Column)({
        default: ''
    }),
    __metadata("design:type", String)
], TeamDocumentEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => team_entity_1.TeamEntity, team => team.documents),
    __metadata("design:type", team_entity_1.TeamEntity)
], TeamDocumentEntity.prototype, "team", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => student_entity_1.StudentEntity, student => student.documents),
    __metadata("design:type", student_entity_1.StudentEntity)
], TeamDocumentEntity.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(type => evaluation_entity_1.EvaluationEntity),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", evaluation_entity_1.EvaluationEntity)
], TeamDocumentEntity.prototype, "evaluation", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => modification_action_entity_1.ModificationActionEntity, modificationAction => modificationAction.teamDocument),
    __metadata("design:type", Array)
], TeamDocumentEntity.prototype, "modificationActions", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => document_types_entity_1.DocumentTypeEntity, td => td.teamDocs),
    __metadata("design:type", document_types_entity_1.DocumentTypeEntity)
], TeamDocumentEntity.prototype, "type", void 0);
TeamDocumentEntity = __decorate([
    (0, typeorm_1.Entity)('team_document')
], TeamDocumentEntity);
exports.TeamDocumentEntity = TeamDocumentEntity;
//# sourceMappingURL=team.document.entity.js.map