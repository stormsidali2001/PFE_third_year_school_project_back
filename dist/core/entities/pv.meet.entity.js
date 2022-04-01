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
exports.PvMeetEntity = void 0;
const typeorm_1 = require("typeorm");
const meet_entity_1 = require("./meet.entity");
const pv_meet_descused_point_entity_1 = require("./pv.meet.descused.point.entity");
const pv_meet_task_todo_entity_1 = require("./pv.meet.task.todo.entity");
let PvMeetEntity = class PvMeetEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PvMeetEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PvMeetEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], PvMeetEntity.prototype, "nextMeetAproximateDate", void 0);
__decorate([
    (0, typeorm_1.Column)('time'),
    __metadata("design:type", Date)
], PvMeetEntity.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PvMeetEntity.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => pv_meet_descused_point_entity_1.DiscusedPointEntity, discusedPoint => discusedPoint.pvMeet),
    __metadata("design:type", Array)
], PvMeetEntity.prototype, "discusedPoints", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => pv_meet_task_todo_entity_1.TaskTodoPvMeetEntity, taskTodo => taskTodo.pvMeet),
    __metadata("design:type", Array)
], PvMeetEntity.prototype, "tasksTodo", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => meet_entity_1.MeetEntity, meet => meet.pvs),
    __metadata("design:type", meet_entity_1.MeetEntity)
], PvMeetEntity.prototype, "meet", void 0);
PvMeetEntity = __decorate([
    (0, typeorm_1.Entity)('pv_meet')
], PvMeetEntity);
exports.PvMeetEntity = PvMeetEntity;
//# sourceMappingURL=pv.meet.entity.js.map