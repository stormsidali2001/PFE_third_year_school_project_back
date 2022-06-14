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
exports.ThemeCommitsController = void 0;
const common_1 = require("@nestjs/common");
const get_current_user_id_decorator_1 = require("../../common/decorators/get-current-user-id.decorator");
const theme_commits_service_1 = require("../services/theme.commits.service");
let ThemeCommitsController = class ThemeCommitsController {
    constructor(themeCommitsService) {
        this.themeCommitsService = themeCommitsService;
    }
    async getTeamCommits(userId, teamId) {
        try {
            return await this.themeCommitsService.getTeamCommits(userId, teamId);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/getTeamsTeacherResponsibleFor');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAllCommitsDocs(userId, teamId) {
        try {
            console.log('sssssssssssssssssssssss');
            return await this.themeCommitsService.getAllCommitsDocs(userId, teamId);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/getAllCommitsDocs');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async validatedDocument(userId, documentIds) {
        try {
            return await this.themeCommitsService.validatedDocument(userId, documentIds);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/validatedDocument');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAllDocsAdmin(userId, promotionId, teamId) {
        try {
            return await this.themeCommitsService.getAllDocsAdmin(userId, promotionId, teamId);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/getAllDocsAdmin');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
__decorate([
    (0, common_1.Get)('getTeamCommits/:teamId'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Param)('teamId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ThemeCommitsController.prototype, "getTeamCommits", null);
__decorate([
    (0, common_1.Get)('getAllCommitsDocs/:teamId'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Param)('teamId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ThemeCommitsController.prototype, "getAllCommitsDocs", null);
__decorate([
    (0, common_1.Post)('validatedDocument'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Body)('documentIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], ThemeCommitsController.prototype, "validatedDocument", null);
__decorate([
    (0, common_1.Get)('getAllDocsAdmin/:promotionId/:teamId'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Param)('promotionId')),
    __param(2, (0, common_1.Param)('teamId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ThemeCommitsController.prototype, "getAllDocsAdmin", null);
ThemeCommitsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [theme_commits_service_1.ThemeCommitsService])
], ThemeCommitsController);
exports.ThemeCommitsController = ThemeCommitsController;
//# sourceMappingURL=theme.commits.controller.js.map