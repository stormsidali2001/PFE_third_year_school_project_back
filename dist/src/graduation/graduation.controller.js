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
exports.GraduationController = void 0;
const common_1 = require("@nestjs/common");
const get_current_user_id_decorator_1 = require("../common/decorators/get-current-user-id.decorator");
const user_dto_1 = require("../core/dtos/user.dto");
const graduation_service_1 = require("./graduation.service");
let GraduationController = class GraduationController {
    constructor(graduationService) {
        this.graduationService = graduationService;
    }
    async createSoutenance(userId, data) {
        try {
            return await this.graduationService.createSoutenance(userId, data);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/createSoutenance');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getSoutenances(userId, promotionId) {
        try {
            return await this.graduationService.getSoutenances(promotionId);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/getSoutenances');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getSoutenance(userId, soutenanceId) {
        try {
            return await this.graduationService.getSoutenance(soutenanceId);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/getSoutenances');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
__decorate([
    (0, common_1.Post)('createSoutenance'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_dto_1.SoutenanceDto]),
    __metadata("design:returntype", Promise)
], GraduationController.prototype, "createSoutenance", null);
__decorate([
    (0, common_1.Get)('getSoutenances/:promotionId'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Param)('promotionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GraduationController.prototype, "getSoutenances", null);
__decorate([
    (0, common_1.Get)('getSoutenance/:soutenanceId'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Param)('soutenanceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GraduationController.prototype, "getSoutenance", null);
GraduationController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [graduation_service_1.GraduationService])
], GraduationController);
exports.GraduationController = GraduationController;
//# sourceMappingURL=graduation.controller.js.map