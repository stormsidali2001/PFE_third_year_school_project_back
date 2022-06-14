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
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const get_current_user_id_decorator_1 = require("../common/decorators/get-current-user-id.decorator");
const public_decorator_1 = require("../common/decorators/public.decorator");
const files_middalewares_1 = require("../common/utils/files-middalewares");
const user_dto_1 = require("../core/dtos/user.dto");
const fs = require("fs");
const path = require("path");
const user_service_1 = require("./user.service");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../core/entities/user.entity");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async sendATeamInvitation(userId, recieverId, description) {
        common_1.Logger.log({ recieverId, description }, 'UserController/sendATeamInvitation');
        return await this.userService.sendATeamInvitation(userId, recieverId, description);
    }
    async acceptRefuseTeamInvitation(invitationId, accepted, userId) {
        return this.userService.acceptRefuseTeamInvitation(invitationId, userId, accepted);
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
    async createTeamAnnouncement(userId, title, description, documents) {
        common_1.Logger.error(documents, "*****555****");
        try {
            return await this.userService.createTeamAnnouncement(userId, title, description, documents);
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
    async getAnnouncement(userId) {
        try {
            return await this.userService.getAnnouncement(userId);
        }
        catch (err) {
            common_1.Logger.error(err, 'UsrController/createSurvey');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getLastNotifications(userId, number) {
        try {
            return await this.userService.getLastNotifications(userId, number);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/getNotifications');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getStudentsWithoutTeam(userId) {
        try {
            return await this.userService.getStudentsWithoutTeam(userId);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/getStudentsWithoutTeam');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getInvitationList(userId) {
        try {
            return await this.userService.getInvitationList(userId);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/getInvitationList');
        }
    }
    async uploadFile(file) {
        const response = {
            originalname: file.originalname,
            filename: file.filename,
            destination: file.destination
        };
        common_1.Logger.warn("file uploaded", response);
        return response;
    }
    async downlaodFile(url, userId) {
        try {
            const manager = (0, typeorm_1.getManager)();
            console.log(url);
            const user = await manager.getRepository(user_entity_1.UserEntity)
                .createQueryBuilder('user')
                .where('user.id = :userId', { userId })
                .getOne();
            if (!user) {
                common_1.Logger.error("permission denied", 'UserController/downlaodFile');
                throw new common_1.HttpException("permission denied", common_1.HttpStatus.BAD_REQUEST);
            }
            const file = fs.readFileSync(path.resolve('./files/' + url));
            return new common_1.StreamableFile(file);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/downlaodFile');
            return "file not found";
        }
    }
    seeUploadedFile(path, res) {
        common_1.Logger.error("getting file" + path, "debug");
        res.set({
            'Content-Disposition': 'attachment; filename="package.json"',
        });
        return res.sendFile(path, { root: './files' });
    }
    async uploadFiles(files) {
        const response = [];
        files.forEach(file => {
            const fileReponse = {
                originalname: file.originalname,
                filename: file.filename,
                destination: file.destination
            };
            response.push(fileReponse);
        });
        common_1.Logger.warn("files uploaded", response);
        return response;
    }
    async addTeamDocument(userId, name, url, description, typeDocId) {
        try {
            return await this.userService.addTeamDocument(userId, name, url, description, typeDocId);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/addTeamDocument');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getDocuments(userId) {
        try {
            return await this.userService.getTeamDocuments(userId);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/getTeamDocuments');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async deleteTeamDocs(userId, docsIds) {
        try {
            return await this.userService.deleteTeamDocs(userId, docsIds);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/deleteTeamDocs');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async commitDocs(userId, title, description, docsIds) {
        try {
            return await this.userService.commitDocs(userId, title, description, docsIds);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/commitDocs');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getTeamsTeacherResponsibleFor(userId) {
        try {
            return await this.userService.getTeamsTeacherResponsibleFor(userId);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/getTeamsTeacherResponsibleFor');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getTeamsTeacherResponsibleForWithMembers(userId, promotionId) {
        try {
            return await this.userService.getTeamsTeacherResponsibleForWithMembers(userId, promotionId);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/getTeamsTeacherResponsibleFor');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAllDocsAdmin(userId, promotionId, teamId) {
        try {
            return await this.userService.getAllDocsAdmin(userId, promotionId, teamId);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/getAllDocsAdmin');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async createSoutenance(userId, data) {
        try {
            return await this.userService.createSoutenance(userId, data);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/createSoutenance');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getSoutenances(userId, promotionId) {
        try {
            return await this.userService.getSoutenances(promotionId);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/getSoutenances');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getSoutenance(userId, soutenanceId) {
        try {
            return await this.userService.getSoutenance(soutenanceId);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/getSoutenances');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getTeamCommits(userId, teamId) {
        try {
            return await this.userService.getTeamCommits(userId, teamId);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/getTeamsTeacherResponsibleFor');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAllCommitsDocs(userId, teamId) {
        try {
            console.log('sssssssssssssssssssssss');
            return await this.userService.getAllCommitsDocs(userId, teamId);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/getAllCommitsDocs');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async validatedDocument(userId, documentIds) {
        try {
            return await this.userService.validatedDocument(userId, documentIds);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/validatedDocument');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getStudents() {
        try {
            return await this.userService.getStudents();
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/getStudents');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async deleteStudent(studentId) {
        try {
            return await this.userService.deleteStudent(studentId);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/addStudent');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async editStudent() {
    }
    async getTeachers() {
        try {
            return await this.userService.getTeachers();
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/getTeachers');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async deleteTeacher(teacherId) {
        try {
            return await this.userService.deleteTeacher(teacherId);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/deleteTeacher');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async editTeacher() {
    }
    async createThemeSuggestion(userId, title, description, documents, promotionId) {
        common_1.Logger.error(documents, "*****555****");
        try {
            return await this.userService.createThemeSuggestion(userId, title, description, documents, promotionId);
        }
        catch (err) {
            common_1.Logger.error(err, 'UsrController/createThemeSuggestion');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getThemeSuggestions(promotionId) {
        try {
            return await this.userService.getThemeSuggestions(promotionId);
        }
        catch (err) {
            common_1.Logger.error(err, 'UsrController/getThemeSuggestions');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAllThemeSuggestions() {
        try {
            return await this.userService.getAllThemeSuggestions();
        }
        catch (err) {
            common_1.Logger.error(err, 'UsrController/getAllThemeSuggestions');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getThemeSuggestion(themeId) {
        try {
            return await this.userService.getThemeSuggestion(themeId);
        }
        catch (err) {
            common_1.Logger.error(err, 'UsrController/getThemeSuggestion');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async validateThemeSuggestion(userId, themeId) {
        try {
            return await this.userService.validateThemeSuggestion(userId, themeId);
        }
        catch (err) {
            common_1.Logger.error(err, 'UsrController/validateThemeSuggestion');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAllThemes() {
        try {
            return await this.userService.getAllThemes();
        }
        catch (err) {
            common_1.Logger.error(err, 'UsrController/getAllThemes');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getThemes(promotionId) {
        try {
            return await this.userService.getThemes(promotionId);
        }
        catch (err) {
            common_1.Logger.error(err, 'UsrController/getThemes');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getTheme(themeId) {
        try {
            return await this.userService.getTheme(themeId);
        }
        catch (err) {
            common_1.Logger.error(err, 'UsrController/getTheme');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getTeams(promotionId) {
        try {
            return await this.userService.getTeams(promotionId);
        }
        catch (err) {
            common_1.Logger.error(err, "UserController/getTeams");
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getTeamsithThemes(promotionId) {
        return await this.userService.getTeamsithThemes(promotionId);
    }
    async getTeam(teamId) {
        try {
            return await this.userService.getTeam(teamId);
        }
        catch (err) {
            common_1.Logger.error(err, "UserController/getTeam");
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getUser(userId) {
        return await this.userService.getUserInfo(userId);
    }
    async getTeamMessages(userId) {
        return await this.userService.getTeamMessages(userId);
    }
    async submitWishList(userId, data) {
        try {
            return await this.userService.submitWishList(userId, data);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/submitWishList');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAllPromotions() {
        try {
            return await this.userService.getAllPromotions();
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/getAllPromotions');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async asignThemesToTeams(userId, promotionId, method) {
        try {
            return await this.userService.asignThemesToTeams(userId, promotionId, method);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/asignThemesToTeams');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async applyThemesToTeamsAssignements(userId, data) {
        try {
            return await this.userService.applyThemesToTeamsAssignements(userId, data);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/applyThemesToTeamsAssignements');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async encadrerTheme(userId, themeId, teacherId) {
        try {
            return await this.userService.encadrerTheme(userId, themeId, teacherId);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/encadrerTheme');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async assignTeamsToTeacher(userId, teamIds, teacherId) {
        try {
            return await this.userService.assignTeamsToTeacher(userId, teamIds, teacherId);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/assignTeamsToTeacher');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getPromotionDocumentTypes(userId) {
        try {
            return await this.userService.getPromotionDocumentTypes(userId);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/getPromotionDocumentTypes');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getSalles() {
        return await this.userService.getSalles();
    }
    async canSoutenir(userId, teamId) {
        try {
            return await this.userService.canSoutenir(userId, teamId);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/sendNotifications');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async sendNotification(userId, description) {
        try {
            return await this.userService._sendNotfication(userId, description);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/sendNotifications');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async createNewConfig(key, value) {
        try {
            console.log(key, value);
            return await this.userService.createNewConfig(key, value);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/createNewConfig');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async createNewPromotion(name, documentTypes) {
        try {
            return await this.userService.createNewPromotion(name, documentTypes);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/createNewPromotion');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async createSalle(name) {
        try {
            return await this.userService.careateSalle(name);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/createNewPromotion');
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
], UserController.prototype, "sendATeamInvitation", null);
__decorate([
    (0, common_1.Post)('/acceptRefuseTeamInvitation'),
    __param(0, (0, common_1.Body)('invitationId')),
    __param(1, (0, common_1.Body)('accepted', common_1.ParseBoolPipe)),
    __param(2, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
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
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Body)('title')),
    __param(2, (0, common_1.Body)('description')),
    __param(3, (0, common_1.Body)('documents')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Array]),
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
    (0, common_1.Get)('getAnnouncement'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAnnouncement", null);
__decorate([
    (0, common_1.Get)('notifications/:number'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Param)('number', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getLastNotifications", null);
__decorate([
    (0, common_1.Get)('getStudentsWithoutTeam'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getStudentsWithoutTeam", null);
__decorate([
    (0, common_1.Get)('getInvitationList'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getInvitationList", null);
__decorate([
    (0, common_1.Post)('uploadFile'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './files',
            filename: files_middalewares_1.editFileName,
        }),
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "uploadFile", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('files/:url'),
    __param(0, (0, common_1.Param)('url')),
    __param(1, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "downlaodFile", null);
__decorate([
    (0, common_1.Get)('getFile/:path'),
    __param(0, (0, common_1.Param)('path')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "seeUploadedFile", null);
__decorate([
    (0, common_1.Post)('uploadFiles'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 10, {
        storage: (0, multer_1.diskStorage)({
            destination: './files',
            filename: files_middalewares_1.editFileName,
        }),
    })),
    __param(0, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "uploadFiles", null);
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
], UserController.prototype, "addTeamDocument", null);
__decorate([
    (0, common_1.Get)('getTeamDocuments'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getDocuments", null);
__decorate([
    (0, common_1.Post)('deleteTeamDocs'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Body)('docsIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteTeamDocs", null);
__decorate([
    (0, common_1.Post)('commitDocs'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Body)('title')),
    __param(2, (0, common_1.Body)('description')),
    __param(3, (0, common_1.Body)('docsIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Array]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "commitDocs", null);
__decorate([
    (0, common_1.Get)('getTeamsTeacherResponsibleFor'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getTeamsTeacherResponsibleFor", null);
__decorate([
    (0, common_1.Get)('getTeamsTeacherResponsibleForWithMembers/:promotionId'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Param)('promotionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getTeamsTeacherResponsibleForWithMembers", null);
__decorate([
    (0, common_1.Get)('getAllDocsAdmin/:promotionId/:teamId'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Param)('promotionId')),
    __param(2, (0, common_1.Param)('teamId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllDocsAdmin", null);
__decorate([
    (0, common_1.Post)('createSoutenance'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_dto_1.SoutenanceDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createSoutenance", null);
__decorate([
    (0, common_1.Get)('getSoutenances/:promotionId'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Param)('promotionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getSoutenances", null);
__decorate([
    (0, common_1.Get)('getSoutenance/:soutenanceId'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Param)('soutenanceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getSoutenance", null);
__decorate([
    (0, common_1.Get)('getTeamCommits/:teamId'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Param)('teamId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getTeamCommits", null);
__decorate([
    (0, common_1.Get)('getAllCommitsDocs/:teamId'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Param)('teamId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllCommitsDocs", null);
__decorate([
    (0, common_1.Post)('validatedDocument'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Body)('documentIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "validatedDocument", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('getStudents'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getStudents", null);
__decorate([
    (0, common_1.Post)('deleteStudent'),
    __param(0, (0, common_1.Body)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteStudent", null);
__decorate([
    (0, common_1.Put)('editStudent'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "editStudent", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('getTeachers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getTeachers", null);
__decorate([
    (0, common_1.Post)('deleteTeacher'),
    __param(0, (0, common_1.Body)('teacherId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteTeacher", null);
__decorate([
    (0, common_1.Put)('editTeacher'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "editTeacher", null);
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
], UserController.prototype, "createThemeSuggestion", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('getThemeSuggestions/:promotionId'),
    __param(0, (0, common_1.Param)('promotionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getThemeSuggestions", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('getThemeSuggestions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllThemeSuggestions", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('getThemeSuggestion/:themeId'),
    __param(0, (0, common_1.Param)('themeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getThemeSuggestion", null);
__decorate([
    (0, common_1.Post)('validateThemeSuggestion'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Body)('themeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "validateThemeSuggestion", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('getThemes'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllThemes", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('getThemes/:promotionId'),
    __param(0, (0, common_1.Param)('promotionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getThemes", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('getTheme/:themeId'),
    __param(0, (0, common_1.Param)('themeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getTheme", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('getAllTeams/:promotionId'),
    __param(0, (0, common_1.Param)('promotionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getTeams", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('getTeamsWithThemes/:promotionId'),
    __param(0, (0, common_1.Param)('promotionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getTeamsithThemes", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('getTeams/:teamId'),
    __param(0, (0, common_1.Param)('teamId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getTeam", null);
__decorate([
    (0, common_1.Get)('getUserInfo'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUser", null);
__decorate([
    (0, common_1.Get)('getTeamMessages'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getTeamMessages", null);
__decorate([
    (0, common_1.Post)('submitWishList'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_dto_1.WishListDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "submitWishList", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('getAllPromotions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllPromotions", null);
__decorate([
    (0, common_1.Post)('asignThemesToTeams'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Body)('promotionId')),
    __param(2, (0, common_1.Body)('method')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "asignThemesToTeams", null);
__decorate([
    (0, common_1.Post)('applyThemesToTeamsAssignements'),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_dto_1.ThemeToTeamDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "applyThemesToTeamsAssignements", null);
__decorate([
    (0, common_1.Post)('encadrerTheme'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Body)('themeId')),
    __param(2, (0, common_1.Body)('teacherId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "encadrerTheme", null);
__decorate([
    (0, common_1.Post)('assignTeamsToTeacher'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Body)('teamIds')),
    __param(2, (0, common_1.Body)('teacherId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "assignTeamsToTeacher", null);
__decorate([
    (0, common_1.Get)('getPromotionDocumentTypes'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getPromotionDocumentTypes", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('getSalles'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getSalles", null);
__decorate([
    (0, common_1.Post)('canSoutenir'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Body)('teamId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "canSoutenir", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('test/sendNotification'),
    __param(0, (0, common_1.Body)('userId')),
    __param(1, (0, common_1.Body)('description')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "sendNotification", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('test/createNewConfig'),
    __param(0, (0, common_1.Body)('key')),
    __param(1, (0, common_1.Body)('value')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createNewConfig", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('test/createNewPromotion'),
    __param(0, (0, common_1.Body)('name')),
    __param(1, (0, common_1.Body)('documentTypes')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createNewPromotion", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('test/createSalle'),
    __param(0, (0, common_1.Body)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createSalle", null);
UserController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map