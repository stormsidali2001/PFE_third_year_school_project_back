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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeSupervisionController = void 0;
const common_1 = require("@nestjs/common");
const get_current_user_id_decorator_1 = require("../../common/decorators/get-current-user-id.decorator");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const theme_supervision_service_1 = require("../services/theme.supervision.service");
let ThemeSupervisionController = class ThemeSupervisionController {
    constructor(themeSupervisionService) {
        this.themeSupervisionService = themeSupervisionService;
    }
    async encadrerTheme(userId, themeId, teacherId) {
        try {
            return await this.themeSupervisionService.encadrerTheme(userId, themeId, teacherId);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/encadrerTheme');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async assignTeamsToTeacher(userId, teamIds, teacherId) {
        try {
            return await this.themeSupervisionService.assignTeamsToTeacher(userId, teamIds, teacherId);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/assignTeamsToTeacher');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getTeamsTeacherResponsibleFor(userId) {
        try {
            return await this.themeSupervisionService.getTeamsTeacherResponsibleFor(userId);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/getTeamsTeacherResponsibleFor');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getTeamsTeacherResponsibleForWithMembers(userId, promotionId) {
        try {
            return await this.themeSupervisionService.getTeamsTeacherResponsibleForWithMembers(userId, promotionId);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/getTeamsTeacherResponsibleFor');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getTeamsithThemes(promotionId) {
        return await this.themeSupervisionService.getTeamsithThemes(promotionId);
    }
    async canSoutenir(userId, teamId) {
        try {
            return await this.themeSupervisionService.canSoutenir(userId, teamId);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/sendNotifications');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
__decorate([
    (0, common_1.Post)('encadrerTheme'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Body)('themeId')),
    __param(2, (0, common_1.Body)('teacherId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ThemeSupervisionController.prototype, "encadrerTheme", null);
__decorate([
    (0, common_1.Post)('assignTeamsToTeacher'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Body)('teamIds')),
    __param(2, (0, common_1.Body)('teacherId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, String]),
    __metadata("design:returntype", Promise)
], ThemeSupervisionController.prototype, "assignTeamsToTeacher", null);
__decorate([
    (0, common_1.Get)('getTeamsTeacherResponsibleFor'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ThemeSupervisionController.prototype, "getTeamsTeacherResponsibleFor", null);
__decorate([
    (0, common_1.Get)('getTeamsTeacherResponsibleForWithMembers/:promotionId'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Param)('promotionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ThemeSupervisionController.prototype, "getTeamsTeacherResponsibleForWithMembers", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('getTeamsWithThemes/:promotionId'),
    __param(0, (0, common_1.Param)('promotionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ThemeSupervisionController.prototype, "getTeamsithThemes", null);
__decorate([
    (0, common_1.Post)('canSoutenir'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Body)('teamId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ThemeSupervisionController.prototype, "canSoutenir", null);
ThemeSupervisionController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [theme_supervision_service_1.ThemeSupervisionService])
], ThemeSupervisionController);
exports.ThemeSupervisionController = ThemeSupervisionController;
//# sourceMappingURL=theme.supervision.controller.js.map