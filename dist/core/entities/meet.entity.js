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
exports.MeetEntity = void 0;
const typeorm_1 = require("typeorm");
const meet_absent_entity_1 = require("./meet.absent.entity");
const pv_meet_entity_1 = require("./pv.meet.entity");
const team_entity_1 = require("./team.entity");
var MeetType;
(function (MeetType) {
    MeetType["URGENTE"] = "urgent";
    MeetType["NORMAL"] = "normal";
})(MeetType || (MeetType = {}));
let MeetEntity = class MeetEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], MeetEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MeetEntity.prototype, "description", void 0);
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
    (0, typeorm_1.OneToOne)(type => pv_meet_entity_1.PvMeetEntity),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", pv_meet_entity_1.PvMeetEntity)
], MeetEntity.prototype, "pvMeet", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => meet_absent_entity_1.MeetAbsentEntity, meetAbsent => meetAbsent.meet),
    __metadata("design:type", Array)
], MeetEntity.prototype, "absences", void 0);
MeetEntity = __decorate([
    (0, typeorm_1.Entity)('meet')
], MeetEntity);
exports.MeetEntity = MeetEntity;
//# sourceMappingURL=meet.entity.js.map