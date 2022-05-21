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
exports.ThemeDocDto = exports.TeamAnnoncementDocDto = exports.UrgentTeamMeetDto = exports.NormalTeamMeetDto = exports.OptionsDto = exports.SurveyDto = exports.AdminDto = exports.EnterpriseTestDTO = exports.EnterpriseDTO = exports.StudentTestDTO = exports.StudentDTO = exports.TeacherTestDTO = exports.TeacherDTO = exports.UserRO = exports.UserDTO = void 0;
const class_transformer_1 = require("class-transformer");
class UserDTO {
}
exports.UserDTO = UserDTO;
class UserRO {
}
exports.UserRO = UserRO;
class TeacherDTO {
}
exports.TeacherDTO = TeacherDTO;
class TeacherTestDTO {
}
exports.TeacherTestDTO = TeacherTestDTO;
class StudentDTO {
}
exports.StudentDTO = StudentDTO;
class StudentTestDTO {
}
exports.StudentTestDTO = StudentTestDTO;
class EnterpriseDTO {
}
exports.EnterpriseDTO = EnterpriseDTO;
class EnterpriseTestDTO {
}
exports.EnterpriseTestDTO = EnterpriseTestDTO;
class AdminDto {
}
exports.AdminDto = AdminDto;
class SurveyDto {
}
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value), { toClassOnly: true }),
    __metadata("design:type", Number)
], SurveyDto.prototype, "period", void 0);
exports.SurveyDto = SurveyDto;
class OptionsDto {
}
exports.OptionsDto = OptionsDto;
class NormalTeamMeetDto {
}
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value), { toClassOnly: true }),
    __metadata("design:type", Number)
], NormalTeamMeetDto.prototype, "weekDay", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value), { toClassOnly: true }),
    __metadata("design:type", Number)
], NormalTeamMeetDto.prototype, "hour", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value), { toClassOnly: true }),
    __metadata("design:type", Number)
], NormalTeamMeetDto.prototype, "minute", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => { parseInt(value); }, { toClassOnly: true }),
    __metadata("design:type", Number)
], NormalTeamMeetDto.prototype, "second", void 0);
exports.NormalTeamMeetDto = NormalTeamMeetDto;
class UrgentTeamMeetDto {
}
exports.UrgentTeamMeetDto = UrgentTeamMeetDto;
class TeamAnnoncementDocDto {
}
exports.TeamAnnoncementDocDto = TeamAnnoncementDocDto;
class ThemeDocDto {
}
exports.ThemeDocDto = ThemeDocDto;
//# sourceMappingURL=user.dto.js.map