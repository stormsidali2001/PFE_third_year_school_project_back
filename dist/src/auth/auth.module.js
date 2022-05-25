"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const auth_controller_1 = require("./auth.controller");
const user_entity_1 = require("../core/entities/user.entity");
const auth_service_1 = require("./auth.service");
const user_repository_1 = require("../core/repositories/user.repository");
const student_entity_1 = require("../core/entities/student.entity");
const team_entity_1 = require("../core/entities/team.entity");
const student_repository_1 = require("../core/repositories/student.repository");
const reset_password_token_repository_1 = require("../core/repositories/reset.password.token.repository");
const jwt_1 = require("@nestjs/jwt");
const local_startegy_1 = require("./strategies/local.startegy");
const passport_1 = require("@nestjs/passport");
const SessionSerializer_1 = require("./utils/SessionSerializer");
const user_module_1 = require("../user/user.module");
const user_service_1 = require("../user/user.service");
let Auth = class Auth {
};
Auth = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_entity_1.UserEntity, user_repository_1.UserRepository, student_entity_1.StudentEntity, team_entity_1.TeamEntity, student_repository_1.StudentRepository, reset_password_token_repository_1.RestPasswordTokenRepository]),
            jwt_1.JwtModule.register({}), passport_1.PassportModule.register({ session: true }),
            user_module_1.UserModule
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService,
            local_startegy_1.LocalStrategy,
            SessionSerializer_1.SessionSerializer,
            user_service_1.UserService
        ]
    })
], Auth);
exports.Auth = Auth;
//# sourceMappingURL=auth.module.js.map