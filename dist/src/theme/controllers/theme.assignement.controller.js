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
exports.ThemeAssignementController = void 0;
const common_1 = require("@nestjs/common");
const get_current_user_id_decorator_1 = require("../../common/decorators/get-current-user-id.decorator");
const user_dto_1 = require("../../core/dtos/user.dto");
const theme_assignement_service_1 = require("../services/theme.assignement.service");
let ThemeAssignementController = class ThemeAssignementController {
    constructor(themeAssignementService) {
        this.themeAssignementService = themeAssignementService;
    }
    async asignThemesToTeams(userId, promotionId, method) {
        try {
            return await this.themeAssignementService.asignThemesToTeams(userId, promotionId, method);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/asignThemesToTeams');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async applyThemesToTeamsAssignements(userId, data) {
        try {
            return await this.themeAssignementService.applyThemesToTeamsAssignements(userId, data);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/applyThemesToTeamsAssignements');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
__decorate([
    (0, common_1.Post)('asignThemesToTeams'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Body)('promotionId')),
    __param(2, (0, common_1.Body)('method')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ThemeAssignementController.prototype, "asignThemesToTeams", null);
__decorate([
    (0, common_1.Post)('applyThemesToTeamsAssignements'),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_dto_1.ThemeToTeamDTO]),
    __metadata("design:returntype", Promise)
], ThemeAssignementController.prototype, "applyThemesToTeamsAssignements", null);
ThemeAssignementController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [theme_assignement_service_1.ThemeAssignementService])
], ThemeAssignementController);
exports.ThemeAssignementController = ThemeAssignementController;
//# sourceMappingURL=theme.assignement.controller.js.map