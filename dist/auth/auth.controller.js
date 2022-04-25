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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const get_current_user_1 = require("../common/decorators/get-current-user");
const get_current_user_id_decorator_1 = require("../common/decorators/get-current-user-id.decorator");
const public_decorator_1 = require("../common/decorators/public.decorator");
const refrech_token_guard_1 = require("../common/guards/refrech-token-guard");
const user_dto_1 = require("../core/dtos/user.dto");
const auth_service_1 = require("./auth.service");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async signin(data) {
        return this.authService.signin(data);
    }
    async signupTeacher(data) {
        return this.authService.signupTeacher(data);
    }
    async signupStudent(data) {
        return await this.authService.signupStudent(data);
    }
    async signupEntereprise(data) {
        return this.authService.signupEnterprise(data);
    }
    async forgotpassword(email) {
        common_1.Logger.log(`${email} sffklfsk`);
        return this.authService.forgotPassword(email);
    }
    async resetPassword(password, token, userId) {
        return this.authService.resetPassword(password, token, userId);
    }
    async refrechToken(userId, refrechtoken) {
        try {
            return await this.authService.refrechToken(userId, refrechtoken);
        }
        catch (error) {
            common_1.Logger.error(error.message, "AuthController/refrechToken");
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async logout(userId) {
        try {
            return await this.authService.logout(userId);
        }
        catch (error) {
            common_1.Logger.error(error.message, "AuthController/logout");
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('signin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.UserDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signin", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('signup/teacher'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.TeacherDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signupTeacher", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('signup/student'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.StudentDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signupStudent", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('signup/entreprise'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.EnterpriseDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signupEntereprise", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('forgotpassword'),
    __param(0, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotpassword", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('resetpassword'),
    __param(0, (0, common_1.Body)('password')),
    __param(1, (0, common_1.Body)('token')),
    __param(2, (0, common_1.Body)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)(refrech_token_guard_1.RefrechTokenGuard),
    (0, common_1.Get)('refrechtoken'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, get_current_user_1.GetCurrentUser)('refrechToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refrechToken", null);
__decorate([
    (0, common_1.Post)('logout'),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
AuthController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map