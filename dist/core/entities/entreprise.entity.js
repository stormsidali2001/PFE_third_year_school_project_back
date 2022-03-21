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
exports.EntrepriseEntity = void 0;
const typeorm_1 = require("typeorm");
const Notification_entity_1 = require("./Notification.entity");
const user_entity_1 = require("./user.entity");
let EntrepriseEntity = class EntrepriseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], EntrepriseEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], EntrepriseEntity.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], EntrepriseEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(type => user_entity_1.UserEntity),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.UserEntity)
], EntrepriseEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => Notification_entity_1.NotificationEntity, notification => notification.entreprise),
    __metadata("design:type", Array)
], EntrepriseEntity.prototype, "notifications", void 0);
EntrepriseEntity = __decorate([
    (0, typeorm_1.Entity)('entreprise')
], EntrepriseEntity);
exports.EntrepriseEntity = EntrepriseEntity;
//# sourceMappingURL=entreprise.entity.js.map