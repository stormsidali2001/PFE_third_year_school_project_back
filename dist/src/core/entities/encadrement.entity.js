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
exports.EncadrementEntity = void 0;
const typeorm_1 = require("typeorm");
const teacher_entity_1 = require("./teacher.entity");
const theme_entity_1 = require("./theme.entity");
let EncadrementEntity = class EncadrementEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], EncadrementEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => teacher_entity_1.TeacherEntity, teacher => teacher.encadrements),
    __metadata("design:type", teacher_entity_1.TeacherEntity)
], EncadrementEntity.prototype, "teacher", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => theme_entity_1.ThemeEntity, theme => theme.encadrement),
    __metadata("design:type", theme_entity_1.ThemeEntity)
], EncadrementEntity.prototype, "theme", void 0);
EncadrementEntity = __decorate([
    (0, typeorm_1.Entity)('encadrement')
], EncadrementEntity);
exports.EncadrementEntity = EncadrementEntity;
//# sourceMappingURL=encadrement.entity.js.map