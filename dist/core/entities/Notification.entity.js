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
exports.NotificationEntity = void 0;
const typeorm_1 = require("typeorm");
const admin_entity_1 = require("./admin.entity");
const entreprise_entity_1 = require("./entreprise.entity");
const student_entity_1 = require("./student.entity");
const teacher_entity_1 = require("./teacher.entity");
let NotificationEntity = class NotificationEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], NotificationEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], NotificationEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], NotificationEntity.prototype, "seen", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => teacher_entity_1.TeacherEntity, teacher => teacher.notifications),
    __metadata("design:type", teacher_entity_1.TeacherEntity)
], NotificationEntity.prototype, "teacher", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => student_entity_1.StudentEntity, student => student.notifications),
    __metadata("design:type", student_entity_1.StudentEntity)
], NotificationEntity.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => admin_entity_1.AdminEntity, admin => admin.notifications),
    __metadata("design:type", admin_entity_1.AdminEntity)
], NotificationEntity.prototype, "admin", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => entreprise_entity_1.EntrepriseEntity, entreprise => entreprise.notifications),
    __metadata("design:type", entreprise_entity_1.EntrepriseEntity)
], NotificationEntity.prototype, "entreprise", void 0);
NotificationEntity = __decorate([
    (0, typeorm_1.Check)('(teacher IS NULL AND student IS NOT NULL AND admin IS NOT NULL  AND entreprise IS NOT NULL) OR (teacher IS NOT NULL AND student IS  NULL AND admin IS NOT NULL  AND entreprise IS NOT NULL) OR (teacher IS NOT NULL AND student IS NOT NULL AND admin IS  NULL  AND entreprise IS NOT NULL) OR (teacher IS NOT NULL AND student IS NOT NULL AND admin IS NOT NULL  AND entreprise IS  NULL)'),
    (0, typeorm_1.Entity)('notification')
], NotificationEntity);
exports.NotificationEntity = NotificationEntity;
//# sourceMappingURL=Notification.entity.js.map