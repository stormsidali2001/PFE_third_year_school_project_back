"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionSerializer = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const student_entity_1 = require("../../core/entities/student.entity");
const user_entity_1 = require("../../core/entities/user.entity");
const typeorm_1 = require("typeorm");
let SessionSerializer = class SessionSerializer extends passport_1.PassportSerializer {
    serializeUser(user, done) {
        common_1.Logger.log("Serializing user ...", "SessionSerializer/serializeUser");
        done(null, user);
    }
    async deserializeUser(user, done) {
        common_1.Logger.log("Serializing user ...", "SessionSerializer/deserializeUser");
        try {
            const userDb = await (0, typeorm_1.getManager)().getRepository(user_entity_1.UserEntity).createQueryBuilder('user')
                .where('user.id = :userId', { userId: user.id })
                .getOne();
            if (!userDb) {
                return done(null, null);
            }
            let entity;
            if (userDb.userType === user_entity_1.UserType.STUDENT) {
                entity = await (0, typeorm_1.getManager)().getRepository(student_entity_1.StudentEntity).createQueryBuilder('student')
                    .where('student.userId = :userId', { userId: user.id })
                    .leftJoinAndSelect('student.team', 'team')
                    .leftJoinAndSelect('team.teamLeader', 'teamLeader')
                    .getOne();
            }
            const responseObj = {
                userType: userDb.userType,
                [`${userDb.userType}`]: Object.assign({}, entity)
            };
            return done(null, responseObj);
        }
        catch (err) {
            common_1.Logger.error(err, "SessionSerializer/deserializeUser");
            throw new common_1.HttpException(err, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
SessionSerializer = __decorate([
    (0, common_1.Injectable)()
], SessionSerializer);
exports.SessionSerializer = SessionSerializer;
//# sourceMappingURL=SessionSerializer.js.map