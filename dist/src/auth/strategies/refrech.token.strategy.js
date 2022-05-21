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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefrechTokenStrategy = void 0;
const config_1 = require("@nestjs/config");
const passport_jwt_1 = require("passport-jwt");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
let RefrechTokenStrategy = class RefrechTokenStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt-refrech') {
    constructor(config) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('ACCESS_TOKEN_SECRET'),
            passReqToCallback: true
        });
    }
    validate(request, payload) {
        var _a;
        const refrechToken = (_a = request === null || request === void 0 ? void 0 : request.get('authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer', '').trim();
        if (!refrechToken) {
            common_1.Logger.error("refresh token mal formated", "RefrechTokenStrategy/validate");
            throw new common_1.HttpException("refresh token mal formated", common_1.HttpStatus.FORBIDDEN);
        }
        return Object.assign(Object.assign({}, payload), { refrechToken });
    }
};
RefrechTokenStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RefrechTokenStrategy);
exports.RefrechTokenStrategy = RefrechTokenStrategy;
//# sourceMappingURL=refrech.token.strategy.js.map