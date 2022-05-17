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
const public_decorator_1 = require("../common/decorators/public.decorator");
const local_auth_guard_1 = require("../common/guards/local-auth.guard");
const user_dto_1 = require("../core/dtos/user.dto");
const auth_service_1 = require("./auth.service");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async signin(req) {
        return req.user;
    }
    async signupTeacher(data) {
        return this.authService.signupTeacher(data);
    }
    async signupTeachers(data) {
        return await this.authService.signupTeachers(data);
    }
    async signupStudent(data) {
        return await this.authService.signupStudent(data);
    }
    async signupStudents(data) {
        return await this.authService.signupStudents(data);
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
    async logout(request) {
        request.logOut();
        request.session.cookie.maxAge = 0;
        return "logedout!!";
    }
    async signupAdmin(admin) {
        return this.authService.signupAdmin(admin);
    }
    async getUser(request) {
        return request.user;
    }
    async signupStudentTest(data) {
        return await this.authService.signupStudentTest(data);
    }
};
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)(local_auth_guard_1.LocalAuthGuard),
    (0, common_1.Post)('signin'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
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
    (0, common_1.Post)('signup/teachers'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signupTeachers", null);
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
    (0, common_1.Post)('signup/students'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signupStudents", null);
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
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)("signupAdmin/afsjsfajgdlgdjdsgljlgjdjgdajsgj;lgdssgd"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.AdminDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signupAdmin", null);
__decorate([
    (0, common_1.Get)('getUserInfo'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getUser", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('signup/studentTest'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.StudentTestDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signupStudentTest", null);
AuthController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map