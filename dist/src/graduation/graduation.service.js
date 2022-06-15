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
exports.GraduationService = void 0;
const common_1 = require("@nestjs/common");
const juryOf_entity_1 = require("../core/entities/juryOf.entity");
const salle_entity_1 = require("../core/entities/salle.entity");
const soutenance_entity_1 = require("../core/entities/soutenance.entity");
const teacher_entity_1 = require("../core/entities/teacher.entity");
const team_entity_1 = require("../core/entities/team.entity");
const user_entity_1 = require("../core/entities/user.entity");
const user_service_1 = require("../user/user.service");
const typeorm_1 = require("typeorm");
let GraduationService = class GraduationService {
    constructor(userService) {
        this.userService = userService;
    }
    async createSoutenance(userId, data) {
        const { title, description, date, jurysIds, salleId, teamId, duration } = data;
        try {
            const manager = (0, typeorm_1.getManager)();
            const user = await manager.getRepository(user_entity_1.UserEntity)
                .createQueryBuilder('user')
                .where('user.id = :userId and user.userType = :userType', { userId, userType: user_entity_1.UserType.ADMIN })
                .getOne();
            if (!user) {
                common_1.Logger.error("permission denied", 'UserService/createSoutenance');
                throw new common_1.HttpException("permission denied", common_1.HttpStatus.BAD_REQUEST);
            }
            const salle = await manager.getRepository(salle_entity_1.SalleEntity)
                .createQueryBuilder('salle')
                .where('salle.id = :salleId', { salleId })
                .getOne();
            if (!salle) {
                common_1.Logger.error("salle not found", 'UserService/createSoutenance');
                throw new common_1.HttpException("salle not found", common_1.HttpStatus.BAD_REQUEST);
            }
            const jurys = await manager.getRepository(teacher_entity_1.TeacherEntity)
                .createQueryBuilder('teacher')
                .where('teacher.id in (:...jurysIds)', { jurysIds })
                .getMany();
            if (jurys.length !== jurysIds.length) {
                common_1.Logger.error("jurys not found", 'UserService/createSoutenance');
                throw new common_1.HttpException("jurys not found", common_1.HttpStatus.BAD_REQUEST);
            }
            const team = await manager.getRepository(team_entity_1.TeamEntity)
                .createQueryBuilder('team')
                .where('team.id = :teamId', { teamId })
                .getOne();
            if (!team) {
                common_1.Logger.error("team not found", 'UserService/createSoutenance');
                throw new common_1.HttpException("team not found", common_1.HttpStatus.BAD_REQUEST);
            }
            if (!team.peutSoutenir) {
                common_1.Logger.error("l'equipe n'est pas encore autoriser a soutenir contactez les ensiegnant responsable.", 'UserService/createSoutenance');
                throw new common_1.HttpException("l'equipe n'est pas prete a soutenir", common_1.HttpStatus.BAD_REQUEST);
            }
            const soutenance = await manager.getRepository(soutenance_entity_1.SoutenanceEntity)
                .createQueryBuilder('soutenance')
                .where('soutenance.teamId = :teamId', { teamId })
                .getOne();
            if (soutenance) {
                common_1.Logger.error("soutenance already created for that team", 'UserService/createSoutenance');
                throw new common_1.HttpException("soutenance already created for that team", common_1.HttpStatus.BAD_REQUEST);
            }
            await (0, typeorm_1.getConnection)().transaction(async (manager) => {
                await manager.getRepository(soutenance_entity_1.SoutenanceEntity)
                    .createQueryBuilder('soutenance')
                    .insert()
                    .values({ title, description, salle, date, team, duration })
                    .execute();
                const insertedSoutenance = await manager.getRepository(soutenance_entity_1.SoutenanceEntity)
                    .createQueryBuilder('soutenance')
                    .where('soutenance.teamId = :teamId', { teamId })
                    .getOne();
                await manager.getRepository(juryOf_entity_1.Jury_of)
                    .createQueryBuilder('jf')
                    .insert()
                    .values(jurys.map(jr => {
                    return {
                        teacher: jr,
                        soutenance: insertedSoutenance
                    };
                }))
                    .execute();
            });
            this.userService._sendTeamNotfication(teamId, `les details de soutenance sont definit pour votre equipe.`);
            return "done";
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/createSoutenance');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getSoutenance(soutenanceId) {
        try {
            const manager = (0, typeorm_1.getManager)();
            return await manager.getRepository(soutenance_entity_1.SoutenanceEntity)
                .createQueryBuilder('soutenance')
                .where('soutenance.id = :soutenanceId', { soutenanceId })
                .leftJoinAndSelect('soutenance.team', 'team')
                .leftJoinAndSelect('team.givenTheme', 'theme')
                .leftJoinAndSelect('soutenance.jurys', 'jurys')
                .leftJoinAndSelect('jurys.teacher', 'teacher')
                .leftJoinAndSelect('soutenance.salle', 'salle')
                .getOne();
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/getSoutenance');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getSoutenances(promotionId) {
        try {
            const manager = (0, typeorm_1.getManager)();
            let query = manager.getRepository(soutenance_entity_1.SoutenanceEntity)
                .createQueryBuilder('soutenance')
                .leftJoinAndSelect('soutenance.team', 'team')
                .leftJoinAndSelect('soutenance.jurys', 'jurys')
                .leftJoinAndSelect('team.promotion', 'promotion');
            if (promotionId !== 'all') {
                query = query.where('promotion.id = :promotionId', { promotionId });
            }
            return await query.getMany();
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/getSoutenances');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
GraduationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], GraduationService);
exports.GraduationService = GraduationService;
//# sourceMappingURL=graduation.service.js.map