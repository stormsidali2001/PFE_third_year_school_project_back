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
exports.UserEntity = exports.UserType = void 0;
const typeorm_1 = require("typeorm");
const Notification_entity_1 = require("./Notification.entity");
const resetPasswordToken_entity_1 = require("./resetPasswordToken.entity");
var UserType;
(function (UserType) {
    UserType["TEACHER"] = "teacher";
    UserType["STUDENT"] = "student";
    UserType["ADMIN"] = "admin";
    UserType["ENTERPRISE"] = "enterprise";
})(UserType = exports.UserType || (exports.UserType = {}));
let UserEntity = class UserEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], UserEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], UserEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], UserEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        unique: true,
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], UserEntity.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: UserType,
        default: UserType.STUDENT
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "userType", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => resetPasswordToken_entity_1.RestPasswordTokenEntity, resetPasswordToken => resetPasswordToken.token),
    __metadata("design:type", Array)
], UserEntity.prototype, "tokens", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => Notification_entity_1.NotificationEntity, notif => notif.user),
    __metadata("design:type", Array)
], UserEntity.prototype, "notifications", void 0);
UserEntity = __decorate([
    (0, typeorm_1.Entity)('user')
], UserEntity);
exports.UserEntity = UserEntity;
//# sourceMappingURL=user.entity.js.map