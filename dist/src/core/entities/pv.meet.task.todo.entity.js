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
exports.TaskTodoPvMeetEntity = void 0;
const typeorm_1 = require("typeorm");
const pv_meet_entity_1 = require("./pv.meet.entity");
let TaskTodoPvMeetEntity = class TaskTodoPvMeetEntity {
    ;
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TaskTodoPvMeetEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TaskTodoPvMeetEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => pv_meet_entity_1.PvMeetEntity, pvMeet => pvMeet.tasksTodo),
    __metadata("design:type", pv_meet_entity_1.PvMeetEntity)
], TaskTodoPvMeetEntity.prototype, "pvMeet", void 0);
TaskTodoPvMeetEntity = __decorate([
    (0, typeorm_1.Entity)('pv_meet_task_todo')
], TaskTodoPvMeetEntity);
exports.TaskTodoPvMeetEntity = TaskTodoPvMeetEntity;
//# sourceMappingURL=pv.meet.task.todo.entity.js.map