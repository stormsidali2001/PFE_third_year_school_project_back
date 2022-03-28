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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_dto_1 = require("../core/dtos/user.dto");
const user_service_1 = require("./user.service");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async getUserInfo(id) {
        return this.userService.getUserInfo(id);
    }
    async sendATeamInvitation(senderId, receiverId, description) {
        return this.userService.sendATeamInvitation(senderId, receiverId, description);
    }
    async acceptRefuseTeamInvitation(invitationId, accepted, recieverId) {
        return this.userService.acceptRefuseTeamInvitation(invitationId, recieverId, accepted);
    }
    async sendTeamJoinRequest(senderId, teamId, description) {
        return this.userService.sendTeamJoinRequest(senderId, teamId, description);
    }
    async getInvitations(studentId) {
        try {
            return await this.userService.getInvitations(studentId);
        }
        catch (err) {
            common_1.Logger.error(err, 'UsrController/getInvitations');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async createTeamAnnouncement(studentId, teamId, title, description) {
        try {
            return await this.userService.createTeamAnnouncement(studentId, teamId, title, description);
        }
        catch (err) {
            common_1.Logger.error(err, 'UsrController/createTeamAnnouncement');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async sendTeamChatMessage(studentId, message) {
        try {
            return await this.userService.sendTeamChatMessage(studentId, message);
        }
        catch (err) {
            common_1.Logger.error(err, 'UsrController/sendTeamChatMessage');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async createSurvey(studentId, survey) {
        try {
            return await this.userService.createSurvey(studentId, survey);
        }
        catch (err) {
            common_1.Logger.error(err, 'UsrController/createSurvey');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async submitSurveyAnswer(studentId, surveyId, optionId, argument) {
        try {
            return await this.userService.submitSurveyAnswer(studentId, surveyId, optionId, argument);
        }
        catch (err) {
            common_1.Logger.error(err, 'UsrController/submitSurveyAnswer');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
__decorate([
    (0, common_1.Post)('/user'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserInfo", null);
__decorate([
    (0, common_1.Post)('/sendATeamInvitation'),
    __param(0, (0, common_1.Body)('senderId')),
    __param(1, (0, common_1.Body)('receiverId')),
    __param(2, (0, common_1.Body)('description')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "sendATeamInvitation", null);
__decorate([
    (0, common_1.Post)('/acceptRefuseTeamInvitation'),
    __param(0, (0, common_1.Body)('invitationId')),
    __param(1, (0, common_1.Body)('accepted', common_1.ParseBoolPipe)),
    __param(2, (0, common_1.Body)('recieverId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "acceptRefuseTeamInvitation", null);
__decorate([
    (0, common_1.Post)('/sendTeamJoinRequest'),
    __param(0, (0, common_1.Body)('senderId')),
    __param(1, (0, common_1.Body)('teamId')),
    __param(2, (0, common_1.Body)('description')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "sendTeamJoinRequest", null);
__decorate([
    (0, common_1.Get)('/invitations/:studentId'),
    __param(0, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getInvitations", null);
__decorate([
    (0, common_1.Post)('/createTeamAnnouncement'),
    __param(0, (0, common_1.Body)('studentId')),
    __param(1, (0, common_1.Body)('teamId')),
    __param(2, (0, common_1.Body)('title')),
    __param(3, (0, common_1.Body)('description')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createTeamAnnouncement", null);
__decorate([
    (0, common_1.Post)('sendTeamChatMessage'),
    __param(0, (0, common_1.Body)('studentId')),
    __param(1, (0, common_1.Body)('message')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "sendTeamChatMessage", null);
__decorate([
    (0, common_1.Post)('createSurvey'),
    __param(0, (0, common_1.Body)('studentId')),
    __param(1, (0, common_1.Body)('survey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_dto_1.SurveyDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createSurvey", null);
__decorate([
    (0, common_1.Post)('submitSurveyAnswer'),
    __param(0, (0, common_1.Body)('studentId')),
    __param(1, (0, common_1.Body)('surveyId')),
    __param(2, (0, common_1.Body)('optionId')),
    __param(3, (0, common_1.Body)('argument')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "submitSurveyAnswer", null);
UserController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map