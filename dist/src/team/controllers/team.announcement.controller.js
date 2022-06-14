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
exports.TeamAnnouncementController = void 0;
const common_1 = require("@nestjs/common");
const get_current_user_id_decorator_1 = require("../../common/decorators/get-current-user-id.decorator");
const team_announcement_service_1 = require("../services/team.announcement.service");
let TeamAnnouncementController = class TeamAnnouncementController {
    constructor(teamAnnouncementService) {
        this.teamAnnouncementService = teamAnnouncementService;
    }
    async getAnnouncements(userId) {
        try {
            return await this.teamAnnouncementService.getAnnouncements(userId);
        }
        catch (err) {
            common_1.Logger.error(err, 'UsrController/createSurvey');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async createTeamAnnouncement(userId, title, description, documents) {
        common_1.Logger.error(documents, "*****555****");
        try {
            return await this.teamAnnouncementService.createTeamAnnouncement(userId, title, description, documents);
        }
        catch (err) {
            common_1.Logger.error(err, 'UsrController/createTeamAnnouncement');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
__decorate([
    (0, common_1.Get)('getAnnouncements'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TeamAnnouncementController.prototype, "getAnnouncements", null);
__decorate([
    (0, common_1.Post)('/createTeamAnnouncement'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Body)('title')),
    __param(2, (0, common_1.Body)('description')),
    __param(3, (0, common_1.Body)('documents')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Array]),
    __metadata("design:returntype", Promise)
], TeamAnnouncementController.prototype, "createTeamAnnouncement", null);
TeamAnnouncementController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [team_announcement_service_1.TeamAnnouncementService])
], TeamAnnouncementController);
exports.TeamAnnouncementController = TeamAnnouncementController;
//# sourceMappingURL=team.announcement.controller.js.map