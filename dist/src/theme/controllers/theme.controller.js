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
exports.ThemeController = void 0;
const common_1 = require("@nestjs/common");
const get_current_user_id_decorator_1 = require("../../common/decorators/get-current-user-id.decorator");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const theme_service_1 = require("../services/theme.service");
let ThemeController = class ThemeController {
    constructor(themeService) {
        this.themeService = themeService;
    }
    async createThemeSuggestion(userId, title, description, documents, promotionId) {
        common_1.Logger.error(documents, "*****555****");
        try {
            return await this.themeService.createThemeSuggestion(userId, title, description, documents, promotionId);
        }
        catch (err) {
            common_1.Logger.error(err, 'UsrController/createThemeSuggestion');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getWishLists(promotionId) {
        return await this.themeService.getWishLists(promotionId);
    }
    async getThemeSuggestions(promotionId) {
        try {
            return await this.themeService.getThemeSuggestions(promotionId);
        }
        catch (err) {
            common_1.Logger.error(err, 'UsrController/getThemeSuggestions');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAllThemeSuggestions() {
        try {
            return await this.themeService.getAllThemeSuggestions();
        }
        catch (err) {
            common_1.Logger.error(err, 'UsrController/getAllThemeSuggestions');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getThemeSuggestion(themeId) {
        try {
            return await this.themeService.getThemeSuggestion(themeId);
        }
        catch (err) {
            common_1.Logger.error(err, 'UsrController/getThemeSuggestion');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async validateThemeSuggestion(userId, themeId) {
        try {
            return await this.themeService.validateThemeSuggestion(userId, themeId);
        }
        catch (err) {
            common_1.Logger.error(err, 'UsrController/validateThemeSuggestion');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAllThemes() {
        try {
            return await this.themeService.getAllThemes();
        }
        catch (err) {
            common_1.Logger.error(err, 'UsrController/getAllThemes');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getThemes(promotionId) {
        try {
            return await this.themeService.getThemes(promotionId);
        }
        catch (err) {
            common_1.Logger.error(err, 'UsrController/getThemes');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getTheme(themeId) {
        try {
            return await this.themeService.getTheme(themeId);
        }
        catch (err) {
            common_1.Logger.error(err, 'UsrController/getTheme');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
__decorate([
    (0, common_1.Post)('/createThemeSuggestion'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Body)('title')),
    __param(2, (0, common_1.Body)('description')),
    __param(3, (0, common_1.Body)('documents')),
    __param(4, (0, common_1.Body)('promotionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Array, String]),
    __metadata("design:returntype", Promise)
], ThemeController.prototype, "createThemeSuggestion", null);
__decorate([
    (0, common_1.Get)('getWishLists/:promotionId'),
    __param(0, (0, common_1.Param)("promotionId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ThemeController.prototype, "getWishLists", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('getThemeSuggestions/:promotionId'),
    __param(0, (0, common_1.Param)('promotionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ThemeController.prototype, "getThemeSuggestions", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('getThemeSuggestions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ThemeController.prototype, "getAllThemeSuggestions", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('getThemeSuggestion/:themeId'),
    __param(0, (0, common_1.Param)('themeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ThemeController.prototype, "getThemeSuggestion", null);
__decorate([
    (0, common_1.Post)('validateThemeSuggestion'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Body)('themeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ThemeController.prototype, "validateThemeSuggestion", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('getThemes'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ThemeController.prototype, "getAllThemes", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('getThemes/:promotionId'),
    __param(0, (0, common_1.Param)('promotionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ThemeController.prototype, "getThemes", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('getTheme/:themeId'),
    __param(0, (0, common_1.Param)('themeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ThemeController.prototype, "getTheme", null);
ThemeController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [theme_service_1.ThemeService])
], ThemeController);
exports.ThemeController = ThemeController;
//# sourceMappingURL=theme.controller.js.map