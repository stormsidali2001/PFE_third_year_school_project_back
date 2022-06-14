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
exports.TeamSurveyController = void 0;
const common_1 = require("@nestjs/common");
const get_current_user_id_decorator_1 = require("../../common/decorators/get-current-user-id.decorator");
const team_survey_service_1 = require("../services/team.survey.service");
let TeamSurveyController = class TeamSurveyController {
    constructor(teamSurveyService) {
        this.teamSurveyService = teamSurveyService;
    }
    async getSurveys(userId) {
        try {
            return await this.teamSurveyService.getSurveys(userId);
        }
        catch (err) {
            common_1.Logger.error(err, "TeamSurveyController/getSurveys");
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getSurvey(userId, surveyId) {
        try {
            return await this.teamSurveyService.getSurvey(userId, surveyId);
        }
        catch (err) {
            common_1.Logger.error(err, "TeamSurveyController/getSurveys");
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async submitSurveyAnswer(userId, surveyId, optionId, argument) {
        try {
            return await this.teamSurveyService.submitSurveyAnswer(userId, surveyId, optionId, argument);
        }
        catch (err) {
            common_1.Logger.error(err, 'TeamSurveyController/submitSurveyAnswer');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getSurveyParticipantsArguments(userId, surveyId, optionId) {
        try {
            return await this.teamSurveyService.getSurveyParticipantsArguments(userId, surveyId, optionId);
        }
        catch (err) {
            common_1.Logger.error(err, 'UsrController/createSurvey');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
__decorate([
    (0, common_1.Get)('surveys'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TeamSurveyController.prototype, "getSurveys", null);
__decorate([
    (0, common_1.Get)('surveys/:surveyId'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Param)('surveyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TeamSurveyController.prototype, "getSurvey", null);
__decorate([
    (0, common_1.Post)('submitSurveyAnswer'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Body)('surveyId')),
    __param(2, (0, common_1.Body)('optionId')),
    __param(3, (0, common_1.Body)('argument')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], TeamSurveyController.prototype, "submitSurveyAnswer", null);
__decorate([
    (0, common_1.Get)('getSurveyParticipantsArguments/:surveyId/:optionId'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Param)('surveyId')),
    __param(2, (0, common_1.Param)('optionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], TeamSurveyController.prototype, "getSurveyParticipantsArguments", null);
TeamSurveyController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [team_survey_service_1.TeamSurveyService])
], TeamSurveyController);
exports.TeamSurveyController = TeamSurveyController;
//# sourceMappingURL=team.survey.controller.js.map