"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeSupervisionService = void 0;
const common_1 = require("@nestjs/common");
const encadrement_entity_1 = require("../../core/entities/encadrement.entity");
const responsible_entity_1 = require("../../core/entities/responsible.entity");
const teacher_entity_1 = require("../../core/entities/teacher.entity");
const team_entity_1 = require("../../core/entities/team.entity");
const theme_entity_1 = require("../../core/entities/theme.entity");
const user_entity_1 = require("../../core/entities/user.entity");
const typeorm_1 = require("typeorm");
let ThemeSupervisionService = class ThemeSupervisionService {
    async encadrerTheme(userId, themeId, teacherId) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const user = manager.getRepository(user_entity_1.UserEntity)
                .createQueryBuilder('user')
                .where("user.id = :userId", { userId })
                .andWhere("user.userType = :userType", { userType: user_entity_1.UserType.ADMIN })
                .getOne();
            if (!user) {
                common_1.Logger.log("permission denied", "UserService/encadrerTheme");
                throw new common_1.HttpException("permission denied", common_1.HttpStatus.BAD_REQUEST);
            }
            const theme = await manager.getRepository(theme_entity_1.ThemeEntity)
                .createQueryBuilder('theme')
                .where('theme.id = :themeId', { themeId })
                .andWhere('theme.validated = true')
                .getOne();
            if (!theme) {
                common_1.Logger.log("theme not found", "UserService/encadrerTheme");
                throw new common_1.HttpException("theme not found", common_1.HttpStatus.BAD_REQUEST);
            }
            const teacher = await manager.getRepository(teacher_entity_1.TeacherEntity)
                .createQueryBuilder('teacher')
                .where('teacher.id = :teacherId', { teacherId })
                .getOne();
            if (!teacher) {
                common_1.Logger.log("teacher not found", "UserService/encadrerTheme");
                throw new common_1.HttpException("teacher not found", common_1.HttpStatus.BAD_REQUEST);
            }
            const encadrement = await manager.getRepository(encadrement_entity_1.EncadrementEntity)
                .createQueryBuilder('encadrement')
                .where('encadrement.teacherId = :teacherId and encadrement.themeId = :themeId', { teacherId, themeId })
                .getOne();
            if (encadrement) {
                common_1.Logger.log("l'ensiegnant est deja un encadreur de ce theme", "UserService/encadrerTheme");
                throw new common_1.HttpException("l'ensiegnant est deja un encadreur de ce theme", common_1.HttpStatus.BAD_REQUEST);
            }
            await manager.getRepository(encadrement_entity_1.EncadrementEntity)
                .createQueryBuilder('')
                .insert()
                .values({ theme, teacher })
                .execute();
        }
        catch (err) {
            common_1.Logger.log(err, "UserService/encadrerTheme");
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async assignTeamsToTeacher(userId, teamIds, teacherId) {
        try {
            console.log(teacherId, 'kkkkkkkkkkkk');
            const manager = (0, typeorm_1.getManager)();
            const user = manager.getRepository(user_entity_1.UserEntity)
                .createQueryBuilder('user')
                .where("user.id = :userId", { userId })
                .andWhere("user.userType = :userType", { userType: user_entity_1.UserType.ADMIN })
                .getOne();
            if (!user) {
                common_1.Logger.log("permission denied", "UserService/assignTeamToTeacher");
                throw new common_1.HttpException("permission denied", common_1.HttpStatus.BAD_REQUEST);
            }
            const encadrement = await manager.getRepository(encadrement_entity_1.EncadrementEntity)
                .createQueryBuilder('encadrement')
                .where('encadrement.teacherId = :teacherId', { teacherId })
                .innerJoinAndSelect('encadrement.teacher', 'teacher')
                .innerJoinAndSelect('encadrement.theme', 'theme')
                .innerJoinAndSelect('theme.teams', 'team')
                .andWhere('team.id IN  (:...teamIds)', { teamIds })
                .getOne();
            if (!encadrement || encadrement && encadrement.theme.teams.length < teamIds.length) {
                common_1.Logger.log("l'ensiegnant doit encadrer le theme affecter a l'equipe", "UserService/assignTeamsToTeacher");
                throw new common_1.HttpException("l'ensiegnant doit encadrer le theme affecter a l'equipe", common_1.HttpStatus.BAD_REQUEST);
            }
            const responsible = await manager.getRepository(responsible_entity_1.ResponsibleEntity)
                .createQueryBuilder('responsible')
                .where('responsible.teamId in (:...teamIds)', { teamIds })
                .andWhere('responsible.teacherId = :teacherId', { teacherId })
                .getMany();
            if (responsible.length > 0) {
                common_1.Logger.log("l(es) equipe(s) sont deja sous la responsabilite de l'ensiegnant", "UserService/assignTeamsToTeacher");
                throw new common_1.HttpException("l(es) equipe(s) sont deja sous la responsabilite de l'ensiegnant", common_1.HttpStatus.BAD_REQUEST);
            }
            await manager.getRepository(responsible_entity_1.ResponsibleEntity)
                .save(encadrement.theme.teams.map(team => {
                return { teacher: encadrement.teacher, team, theme: encadrement.theme };
            }));
        }
        catch (err) {
            common_1.Logger.log(err, "UserService/assignTeamToTeacher");
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getTeamsTeacherResponsibleFor(userId, themeId) {
        try {
            const manager = (0, typeorm_1.getManager)();
            let query = manager.getRepository(team_entity_1.TeamEntity)
                .createQueryBuilder('team')
                .leftJoinAndSelect('team.responsibleTeachers', 'responsibleTeachers')
                .leftJoinAndSelect('responsibleTeachers.teacher', 'teacher')
                .leftJoinAndSelect('responsibleTeachers.theme', 'theme')
                .where('teacher.userId = :userId', { userId });
            if (themeId !== 'all') {
                query = query.andWhere("responsibleTeachers.themeId = :themeId", { themeId });
            }
            return await query.getMany();
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/getTeamsTeacherResponsibleFor');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getTeamsTeacherResponsibleForWithMembers(userId, promotionId) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const query = manager.getRepository(team_entity_1.TeamEntity)
                .createQueryBuilder('team')
                .leftJoinAndSelect('team.responsibleTeachers', 'responsibleTeachers')
                .leftJoinAndSelect('responsibleTeachers.teacher', 'teacher')
                .where('teacher.userId = :userId', { userId })
                .leftJoinAndSelect('team.students', 'students')
                .leftJoinAndSelect('team.teamLeader', 'leader');
            if (promotionId !== 'all') {
                return await query
                    .andWhere('team.promotionId = :promotionId', { promotionId })
                    .getMany();
            }
            else {
                return await query.getMany();
            }
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/getTeamsTeacherResponsibleForWithMembers');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getTeamsithThemes(promotionId) {
        try {
            const manager = (0, typeorm_1.getManager)();
            let query = manager.getRepository(team_entity_1.TeamEntity)
                .createQueryBuilder('team')
                .where('team.peutSoutenir = true')
                .innerJoinAndSelect('team.givenTheme', 'givenTheme')
                .leftJoinAndSelect('team.promotion', 'promotion');
            if (promotionId !== 'all') {
                query = query.where('promotion.id = :promotionId', { promotionId });
            }
            const teams = await query.getMany();
            return teams.map(({ nickName, givenTheme, membersCount, id, promotion }) => {
                common_1.Logger.error(nickName, promotion, "debug");
                return {
                    id,
                    pseudo: nickName,
                    theme: givenTheme,
                    nombre: membersCount,
                    promotion: promotion.name,
                    validated: membersCount >= promotion.minMembersInTeam && membersCount <= promotion.maxMembersInTeam
                };
            });
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/getTeams');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async canSoutenir(userId, teamId) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const user = await manager.getRepository(user_entity_1.UserEntity)
                .createQueryBuilder('user')
                .where('user.id = :userId and user.userType = :userType', { userId, userType: user_entity_1.UserType.TEACHER })
                .getOne();
            if (!user) {
                common_1.Logger.error("permission denied", 'UserService/canSoutenir');
                throw new common_1.HttpException("permission denied", common_1.HttpStatus.BAD_REQUEST);
            }
            const team = await manager.getRepository(team_entity_1.TeamEntity)
                .createQueryBuilder('team')
                .where('team.id = :teamId and team.givenTheme IS NOT NULL', { teamId })
                .innerJoin('team.responsibleTeachers', 'responsibleTeachers')
                .innerJoin('responsibleTeachers.teacher', 'teacher')
                .andWhere('teacher.userId = :userId', { userId })
                .getOne();
            if (!team) {
                common_1.Logger.error("team not found or theme", 'UserService/canSoutenir');
                throw new common_1.HttpException("team not found or theme", common_1.HttpStatus.BAD_REQUEST);
            }
            await manager.getRepository(team_entity_1.TeamEntity)
                .createQueryBuilder('team')
                .update()
                .where('team.id = :teamId', { teamId })
                .set({ peutSoutenir: true })
                .execute();
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/canSoutenir');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
ThemeSupervisionService = __decorate([
    (0, common_1.Injectable)()
], ThemeSupervisionService);
exports.ThemeSupervisionService = ThemeSupervisionService;
//# sourceMappingURL=theme.supervision.service.js.map