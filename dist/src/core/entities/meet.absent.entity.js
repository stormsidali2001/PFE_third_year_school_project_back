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
exports.MeetAbsentEntity = void 0;
const typeorm_1 = require("typeorm");
const meet_entity_1 = require("./meet.entity");
const student_entity_1 = require("./student.entity");
let MeetAbsentEntity = class MeetAbsentEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], MeetAbsentEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MeetAbsentEntity.prototype, "cause", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => student_entity_1.StudentEntity, student => student.meetAbsences),
    __metadata("design:type", student_entity_1.StudentEntity)
], MeetAbsentEntity.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => meet_entity_1.MeetEntity, meet => meet.absences),
    __metadata("design:type", meet_entity_1.MeetEntity)
], MeetAbsentEntity.prototype, "meet", void 0);
MeetAbsentEntity = __decorate([
    (0, typeorm_1.Entity)('meet_absent')
], MeetAbsentEntity);
exports.MeetAbsentEntity = MeetAbsentEntity;
//# sourceMappingURL=meet.absent.entity.js.map