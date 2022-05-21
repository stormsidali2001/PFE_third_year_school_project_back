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
exports.ModificationActionEntity = exports.ModificationType = void 0;
const typeorm_1 = require("typeorm");
const team_document_entity_1 = require("./team.document.entity");
const team_entity_1 = require("./team.entity");
var ModificationType;
(function (ModificationType) {
    ModificationType["INSERTION"] = "insertion";
    ModificationType["DELETION"] = "deletion";
    ModificationType["UPDATE"] = "update";
})(ModificationType = exports.ModificationType || (exports.ModificationType = {}));
let ModificationActionEntity = class ModificationActionEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ModificationActionEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ModificationType,
        default: ModificationType.INSERTION
    }),
    __metadata("design:type", String)
], ModificationActionEntity.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ModificationActionEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => team_document_entity_1.TeamDocumentEntity, teamDoucment => teamDoucment.modificationActions),
    __metadata("design:type", team_document_entity_1.TeamDocumentEntity)
], ModificationActionEntity.prototype, "teamDocument", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => team_entity_1.TeamEntity, team => team.modificationActions),
    __metadata("design:type", team_entity_1.TeamEntity)
], ModificationActionEntity.prototype, "team", void 0);
ModificationActionEntity = __decorate([
    (0, typeorm_1.Entity)('modification_action')
], ModificationActionEntity);
exports.ModificationActionEntity = ModificationActionEntity;
//# sourceMappingURL=modification.action.entity.js.map