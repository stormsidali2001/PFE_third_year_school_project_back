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
exports.ResponsibleEntity = void 0;
const typeorm_1 = require("typeorm");
const teacher_entity_1 = require("./teacher.entity");
const team_entity_1 = require("./team.entity");
const theme_entity_1 = require("./theme.entity");
let ResponsibleEntity = class ResponsibleEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ResponsibleEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ResponsibleEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => teacher_entity_1.TeacherEntity, teacher => teacher.teamsInCharge),
    __metadata("design:type", teacher_entity_1.TeacherEntity)
], ResponsibleEntity.prototype, "teacher", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => team_entity_1.TeamEntity, team => team.responsibleTeachers),
    __metadata("design:type", team_entity_1.TeamEntity)
], ResponsibleEntity.prototype, "team", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => theme_entity_1.ThemeEntity, theme => theme.resbonsibilities),
    __metadata("design:type", theme_entity_1.ThemeEntity)
], ResponsibleEntity.prototype, "theme", void 0);
ResponsibleEntity = __decorate([
    (0, typeorm_1.Entity)('responsible')
], ResponsibleEntity);
exports.ResponsibleEntity = ResponsibleEntity;
//# sourceMappingURL=responsible.entity.js.map