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
exports.TeamChatController = void 0;
const common_1 = require("@nestjs/common");
const get_current_user_id_decorator_1 = require("../../common/decorators/get-current-user-id.decorator");
const team_chat_service_1 = require("../services/team.chat.service");
let TeamChatController = class TeamChatController {
    constructor(teamChatService) {
        this.teamChatService = teamChatService;
    }
    async sendTeamChatMessage(studentId, message) {
        try {
            return await this.teamChatService.sendTeamChatMessage(studentId, message);
        }
        catch (err) {
            common_1.Logger.error(err, 'UsrController/sendTeamChatMessage');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getTeamMessages(userId) {
        return await this.teamChatService.getTeamMessages(userId);
    }
};
__decorate([
    (0, common_1.Post)('sendTeamChatMessage'),
    __param(0, (0, common_1.Body)('studentId')),
    __param(1, (0, common_1.Body)('message')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TeamChatController.prototype, "sendTeamChatMessage", null);
__decorate([
    (0, common_1.Get)('getTeamMessages'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TeamChatController.prototype, "getTeamMessages", null);
TeamChatController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [team_chat_service_1.TeamChatService])
], TeamChatController);
exports.TeamChatController = TeamChatController;
//# sourceMappingURL=team.chat.controller.js.map