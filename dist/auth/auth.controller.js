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
        return this.authService.signupStudent(data);
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
};
__decorate([
    (0, common_1.Post)('signin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.UserDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signin", null);
__decorate([
    (0, common_1.Post)('signup/teacher'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.TeacherDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signupTeacher", null);
__decorate([
    (0, common_1.Post)('signup/student'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.StudentDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signupStudent", null);
__decorate([
    (0, common_1.Post)('signup/entreprise'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.EnterpriseDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signupEntereprise", null);
__decorate([
    (0, common_1.Post)('forgotpassword'),
    __param(0, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotpassword", null);
__decorate([
    (0, common_1.Post)('resetpassword/:token/:uid'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('token')),
    __param(2, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
AuthController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map