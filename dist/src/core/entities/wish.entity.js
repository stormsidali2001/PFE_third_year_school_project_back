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
exports.WishEntity = void 0;
const typeorm_1 = require("typeorm");
const team_entity_1 = require("./team.entity");
const theme_entity_1 = require("./theme.entity");
let WishEntity = class WishEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], WishEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], WishEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], WishEntity.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => team_entity_1.TeamEntity, team => team.wishes),
    __metadata("design:type", team_entity_1.TeamEntity)
], WishEntity.prototype, "team", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => theme_entity_1.ThemeEntity, theme => theme.wishes),
    __metadata("design:type", theme_entity_1.ThemeEntity)
], WishEntity.prototype, "theme", void 0);
WishEntity = __decorate([
    (0, typeorm_1.Entity)('wish')
], WishEntity);
exports.WishEntity = WishEntity;
//# sourceMappingURL=wish.entity.js.map