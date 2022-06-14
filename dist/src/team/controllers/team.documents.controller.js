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
exports.TeamDocumentsController = void 0;
const common_1 = require("@nestjs/common");
const get_current_user_id_decorator_1 = require("../../common/decorators/get-current-user-id.decorator");
const team_documents_service_1 = require("../services/team.documents.service");
let TeamDocumentsController = class TeamDocumentsController {
    constructor(teamDocumentsService) {
        this.teamDocumentsService = teamDocumentsService;
    }
    async addTeamDocument(userId, name, url, description, typeDocId) {
        try {
            return await this.teamDocumentsService.addTeamDocument(userId, name, url, description, typeDocId);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/addTeamDocument');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getDocuments(userId) {
        try {
            return await this.teamDocumentsService.getTeamDocuments(userId);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/getTeamDocuments');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async deleteTeamDocs(userId, docsIds) {
        try {
            return await this.teamDocumentsService.deleteTeamDocs(userId, docsIds);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/deleteTeamDocs');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async updateTeamDocument(userId, documentId, description, name, documentTypeId) {
        try {
            return await this.teamDocumentsService.updateTeamDocument(userId, documentId, description, name, documentTypeId);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/updateDocument');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async commitDocs(userId, title, description, docsIds) {
        try {
            return await this.teamDocumentsService.commitDocs(userId, title, description, docsIds);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/commitDocs');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
__decorate([
    (0, common_1.Post)('addTeamDocument'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Body)('name')),
    __param(2, (0, common_1.Body)('url')),
    __param(3, (0, common_1.Body)('description')),
    __param(4, (0, common_1.Body)('typeDocId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], TeamDocumentsController.prototype, "addTeamDocument", null);
__decorate([
    (0, common_1.Get)('getTeamDocuments'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TeamDocumentsController.prototype, "getDocuments", null);
__decorate([
    (0, common_1.Post)('deleteTeamDocs'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Body)('docsIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], TeamDocumentsController.prototype, "deleteTeamDocs", null);
__decorate([
    (0, common_1.Post)('updateTeamDocument'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Body)("documentId")),
    __param(2, (0, common_1.Body)("description")),
    __param(3, (0, common_1.Body)("name")),
    __param(4, (0, common_1.Body)("documentTypeId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], TeamDocumentsController.prototype, "updateTeamDocument", null);
__decorate([
    (0, common_1.Post)('commitDocs'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Body)('title')),
    __param(2, (0, common_1.Body)('description')),
    __param(3, (0, common_1.Body)('docsIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Array]),
    __metadata("design:returntype", Promise)
], TeamDocumentsController.prototype, "commitDocs", null);
TeamDocumentsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [team_documents_service_1.TeamDocumentsService])
], TeamDocumentsController);
exports.TeamDocumentsController = TeamDocumentsController;
//# sourceMappingURL=team.documents.controller.js.map