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
exports.TeamInvitationController = void 0;
const common_1 = require("@nestjs/common");
const get_current_user_id_decorator_1 = require("../../common/decorators/get-current-user-id.decorator");
const team_invitation_service_1 = require("../services/team.invitation.service");
let TeamInvitationController = class TeamInvitationController {
    constructor(teamInvitationService) {
        this.teamInvitationService = teamInvitationService;
    }
    async sendATeamInvitation(userId, recieverId, description) {
        return await this.teamInvitationService.sendATeamInvitation(userId, recieverId, description);
    }
    async acceptRefuseTeamInvitation(invitationId, accepted, userId) {
        return this.teamInvitationService.acceptRefuseTeamInvitation(invitationId, userId, accepted);
    }
    async sendTeamJoinRequest(senderId, teamId, description) {
        return this.teamInvitationService.sendTeamJoinRequest(senderId, teamId, description);
    }
    async getStudentsWithoutTeam(userId) {
        try {
            return await this.teamInvitationService.getStudentsWithoutTeam(userId);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/getStudentsWithoutTeam');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getInvitationList(userId) {
        try {
            return await this.teamInvitationService.getInvitationList(userId);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/getInvitationList');
        }
    }
    async getInvitations(studentId) {
        try {
            return await this.teamInvitationService.getInvitations(studentId);
        }
        catch (err) {
            common_1.Logger.error(err, 'UsrController/getInvitations');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
__decorate([
    (0, common_1.Post)('/sendATeamInvitation'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Body)('recieverId')),
    __param(2, (0, common_1.Body)('description')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], TeamInvitationController.prototype, "sendATeamInvitation", null);
__decorate([
    (0, common_1.Post)('/acceptRefuseTeamInvitation'),
    __param(0, (0, common_1.Body)('invitationId')),
    __param(1, (0, common_1.Body)('accepted', common_1.ParseBoolPipe)),
    __param(2, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean, String]),
    __metadata("design:returntype", Promise)
], TeamInvitationController.prototype, "acceptRefuseTeamInvitation", null);
__decorate([
    (0, common_1.Post)('/sendTeamJoinRequest'),
    __param(0, (0, common_1.Body)('senderId')),
    __param(1, (0, common_1.Body)('teamId')),
    __param(2, (0, common_1.Body)('description')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], TeamInvitationController.prototype, "sendTeamJoinRequest", null);
__decorate([
    (0, common_1.Get)('getStudentsWithoutTeam'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TeamInvitationController.prototype, "getStudentsWithoutTeam", null);
__decorate([
    (0, common_1.Get)('getInvitationList'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TeamInvitationController.prototype, "getInvitationList", null);
__decorate([
    (0, common_1.Get)('/invitations/:studentId'),
    __param(0, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TeamInvitationController.prototype, "getInvitations", null);
TeamInvitationController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [team_invitation_service_1.TeamInvitationService])
], TeamInvitationController);
exports.TeamInvitationController = TeamInvitationController;
//# sourceMappingURL=team.invitation.controller.js.map