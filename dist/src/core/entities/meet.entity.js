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
exports.MeetEntity = exports.MeetType = void 0;
const typeorm_1 = require("typeorm");
const meet_absent_entity_1 = require("./meet.absent.entity");
const pv_meet_entity_1 = require("./pv.meet.entity");
const team_entity_1 = require("./team.entity");
var MeetType;
(function (MeetType) {
    MeetType["URGENTE"] = "urgent";
    MeetType["NORMAL"] = "normal";
})(MeetType = exports.MeetType || (exports.MeetType = {}));
let MeetEntity = class MeetEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], MeetEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MeetEntity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MeetEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null }),
    __metadata("design:type", Date)
], MeetEntity.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null }),
    __metadata("design:type", Number)
], MeetEntity.prototype, "weekDay", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null }),
    __metadata("design:type", Number)
], MeetEntity.prototype, "hour", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null }),
    __metadata("design:type", Number)
], MeetEntity.prototype, "minute", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null }),
    __metadata("design:type", Number)
], MeetEntity.prototype, "second", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], MeetEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MeetType,
        default: MeetType.NORMAL
    }),
    __metadata("design:type", String)
], MeetEntity.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => team_entity_1.TeamEntity, team => team.meets),
    __metadata("design:type", team_entity_1.TeamEntity)
], MeetEntity.prototype, "team", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => pv_meet_entity_1.PvMeetEntity, pv => pv.meet),
    __metadata("design:type", Array)
], MeetEntity.prototype, "pvs", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => meet_absent_entity_1.MeetAbsentEntity, meetAbsent => meetAbsent.meet),
    __metadata("design:type", Array)
], MeetEntity.prototype, "absences", void 0);
MeetEntity = __decorate([
    (0, typeorm_1.Entity)('meet')
], MeetEntity);
exports.MeetEntity = MeetEntity;
//# sourceMappingURL=meet.entity.js.map