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
exports.SoutenanceEntity = void 0;
const typeorm_1 = require("typeorm");
const juryOf_entity_1 = require("./juryOf.entity");
const salle_entity_1 = require("./salle.entity");
const team_entity_1 = require("./team.entity");
let SoutenanceEntity = class SoutenanceEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SoutenanceEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SoutenanceEntity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SoutenanceEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SoutenanceEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], SoutenanceEntity.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SoutenanceEntity.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(type => team_entity_1.TeamEntity),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", team_entity_1.TeamEntity)
], SoutenanceEntity.prototype, "team", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => juryOf_entity_1.Jury_of, jf => jf.soutenance),
    __metadata("design:type", Array)
], SoutenanceEntity.prototype, "jurys", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => salle_entity_1.SalleEntity, s => s.soutenances),
    __metadata("design:type", salle_entity_1.SalleEntity)
], SoutenanceEntity.prototype, "salle", void 0);
SoutenanceEntity = __decorate([
    (0, typeorm_1.Entity)('soutenance')
], SoutenanceEntity);
exports.SoutenanceEntity = SoutenanceEntity;
//# sourceMappingURL=soutenance.entity.js.map