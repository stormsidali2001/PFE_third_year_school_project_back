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
exports.Jury_of = void 0;
const typeorm_1 = require("typeorm");
const soutenance_entity_1 = require("./soutenance.entity");
const teacher_entity_1 = require("./teacher.entity");
let Jury_of = class Jury_of {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Jury_of.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Jury_of.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => soutenance_entity_1.SoutenanceEntity, s => s.jurys),
    __metadata("design:type", soutenance_entity_1.SoutenanceEntity)
], Jury_of.prototype, "soutenance", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => teacher_entity_1.TeacherEntity, t => t.soutenances),
    __metadata("design:type", teacher_entity_1.TeacherEntity)
], Jury_of.prototype, "teacher", void 0);
Jury_of = __decorate([
    (0, typeorm_1.Entity)('jury_of')
], Jury_of);
exports.Jury_of = Jury_of;
//# sourceMappingURL=juryOf.entity.js.map