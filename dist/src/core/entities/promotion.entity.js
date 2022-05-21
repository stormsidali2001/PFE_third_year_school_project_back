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
exports.PromotionEntity = void 0;
const typeorm_1 = require("typeorm");
const student_entity_1 = require("./student.entity");
const team_entity_1 = require("./team.entity");
const theme_entity_1 = require("./theme.entity");
let PromotionEntity = class PromotionEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PromotionEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        unique: true
    }),
    __metadata("design:type", String)
], PromotionEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: 4
    }),
    __metadata("design:type", Number)
], PromotionEntity.prototype, "minTeam", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: 6
    }),
    __metadata("design:type", Number)
], PromotionEntity.prototype, "maxTeam", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => team_entity_1.TeamEntity, team => team.promotion),
    __metadata("design:type", Array)
], PromotionEntity.prototype, "teams", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => student_entity_1.StudentEntity, student => student.promotion),
    __metadata("design:type", Array)
], PromotionEntity.prototype, "students", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => theme_entity_1.ThemeEntity, theme => theme.promotion),
    __metadata("design:type", Array)
], PromotionEntity.prototype, "themes", void 0);
PromotionEntity = __decorate([
    (0, typeorm_1.Entity)('promotion')
], PromotionEntity);
exports.PromotionEntity = PromotionEntity;
//# sourceMappingURL=promotion.entity.js.map