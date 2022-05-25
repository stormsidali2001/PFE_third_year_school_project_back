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
exports.TeamTeacherChatMessage = void 0;
const typeorm_1 = require("typeorm");
const student_entity_1 = require("./student.entity");
const teacher_entity_1 = require("./teacher.entity");
const team_entity_1 = require("./team.entity");
let TeamTeacherChatMessage = class TeamTeacherChatMessage {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TeamTeacherChatMessage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TeamTeacherChatMessage.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TeamTeacherChatMessage.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => team_entity_1.TeamEntity, team => team.teamMessages),
    __metadata("design:type", team_entity_1.TeamEntity)
], TeamTeacherChatMessage.prototype, "team", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => student_entity_1.StudentEntity, student => student.teamChatMessages),
    __metadata("design:type", student_entity_1.StudentEntity)
], TeamTeacherChatMessage.prototype, "ownerS", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => teacher_entity_1.TeacherEntity, teacher => teacher.teamTeacherChatMessages),
    __metadata("design:type", teacher_entity_1.TeacherEntity)
], TeamTeacherChatMessage.prototype, "ownerT", void 0);
TeamTeacherChatMessage = __decorate([
    (0, typeorm_1.Entity)('team_teacher_chat_message'),
    (0, typeorm_1.Check)('(ownerS IS NOT NULL AND ownerT IS NULL) OR (ownerS IS NULL AND ownerT IS NOT NULL)')
], TeamTeacherChatMessage);
exports.TeamTeacherChatMessage = TeamTeacherChatMessage;
//# sourceMappingURL=team.teacher.message.entity.js.map