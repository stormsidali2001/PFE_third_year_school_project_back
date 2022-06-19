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
    async getLastNotifications(userId, number) {
        try {
            return await this.userService.getLastNotifications(userId, number);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserController/getNotifications');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
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
    async getTeams(promotionId) {
        try {
            return await this.userService.getTeams(promotionId);
        }
        catch (err) {
            common_1.Logger.error(err, "UserController/getTeams");
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
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
    async getStudentInfos(studentId) {
        return await this.userService.getStudentInfos(studentId);
    }
    async sendWishList(userId, promotionId) {
        await this.userService.sendWishList(userId, promotionId);
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
    (0, common_1.Get)('notifications/:number'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Param)('number', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getLastNotifications", null);
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
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('getAllTeams/:promotionId'),
    __param(0, (0, common_1.Param)('promotionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getTeams", null);
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
    (0, common_1.Get)('studentsInfo/:studentId'),
    __param(0, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getStudentInfos", null);
__decorate([
    (0, common_1.Post)("sendWishList"),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Body)('promotionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "sendWishList", null);
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