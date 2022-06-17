"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamService = void 0;
const common_1 = require("@nestjs/common");
const promotion_entity_1 = require("../../core/entities/promotion.entity");
const student_entity_1 = require("../../core/entities/student.entity");
const team_entity_1 = require("../../core/entities/team.entity");
const user_entity_1 = require("../../core/entities/user.entity");
const typeorm_1 = require("typeorm");
const uniqid = require("uniqid");
let TeamService = class TeamService {
    async getTeamsStats(userId, promotionId) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const user = await manager.getRepository(user_entity_1.UserEntity)
                .createQueryBuilder('user')
                .where("user.id = :userId", { userId })
                .andWhere("user.userType = :userType", { userType: user_entity_1.UserType.ADMIN })
                .getOne();
            if (!user) {
                common_1.Logger.log("permission denied", "TeamService/getTeamsStats");
                throw new common_1.HttpException("permission denied", common_1.HttpStatus.BAD_REQUEST);
            }
            const promotion = await manager.getRepository(promotion_entity_1.PromotionEntity)
                .createQueryBuilder('promotion')
                .where('promotion.id = :promotionId', { promotionId })
                .loadRelationCountAndMap("promotion.studentsWithoutATeam", "promotion.students", "pStudents", qb => qb.where('pStudents.teamId is NULL'))
                .loadRelationCountAndMap("promotion.notCompleteTeams", "promotion.teams", "teams", qb => {
                const promotionQuery1 = qb.subQuery()
                    .select('minMembersInTeam')
                    .from(promotion_entity_1.PromotionEntity, 'p')
                    .where('p.id = :promotionId', { promotionId })
                    .getQuery();
                const subQuery = qb.subQuery()
                    .select('COUNT(st.id)')
                    .from(student_entity_1.StudentEntity, 'st')
                    .where('st.teamId = teams.id ')
                    .getQuery();
                return qb.where(`${promotionQuery1} > (${subQuery})`);
            })
                .getOne();
            if (!promotion) {
                common_1.Logger.log("promotion not found", "TeamService/getTeamsStats");
                throw new common_1.HttpException("promotion not found", common_1.HttpStatus.BAD_REQUEST);
            }
            return promotion;
        }
        catch (err) {
            common_1.Logger.log(err, "TeamService/getTeamsStats");
            throw new common_1.HttpException(err, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async completeTeams(userId, promotionId) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const user = await manager.getRepository(user_entity_1.UserEntity)
                .createQueryBuilder('user')
                .where("user.id = :userId", { userId })
                .andWhere("user.userType = :userType", { userType: user_entity_1.UserType.ADMIN })
                .getOne();
            const promotion = await manager.getRepository(promotion_entity_1.PromotionEntity)
                .createQueryBuilder('promotion')
                .where('promotion.id = :promotionId', { promotionId })
                .leftJoinAndSelect("promotion.teams", "team")
                .leftJoinAndSelect('team.students', 'teamStudents')
                .leftJoinAndSelect("promotion.students", "pstudents", "pstudents.teamId IS NULL")
                .leftJoinAndSelect('team.teamLeader', 'teamLeader')
                .getOne();
            if (!user) {
                common_1.Logger.log("permission denied", "UserService/submitWishList");
                throw new common_1.HttpException("permission denied", common_1.HttpStatus.BAD_REQUEST);
            }
            if (!promotion) {
                common_1.Logger.log("promotion not found", "UserService/submitWishList");
                throw new common_1.HttpException("promotion not found", common_1.HttpStatus.BAD_REQUEST);
            }
            const teams = promotion.teams;
            const studentDeleted = [];
            const studentAdded = [];
            const newTeams = [];
            let extraStudents = promotion.students;
            const INITIAL_TEAMS = [...teams];
            const INITIAL_EXTRA_STUDENTS = [...extraStudents];
            const MIN = promotion.minMembersInTeam;
            const MAX = promotion.maxMembersInTeam;
            const getStudentNotTeamLeader = (team) => {
                let i = 0;
                const students = team.students;
                while (i < students.length) {
                    const st = students[i];
                    if (st.id !== team.teamLeader.id) {
                        return st;
                    }
                    i++;
                }
                return null;
            };
            teams.forEach((team, index, teamsArr) => {
                while (team.students.length > MIN) {
                    const st = getStudentNotTeamLeader(team);
                    if (!st) {
                        common_1.Logger.log("student expect team leader not found", "UserService/completeTeams");
                        throw new common_1.HttpException("student expect team leader not found", common_1.HttpStatus.BAD_REQUEST);
                    }
                    extraStudents.push(st);
                    teamsArr[index].students = teamsArr[index].students.filter(s => s.id !== st.id);
                    studentDeleted.push({ student: Object.assign({}, st), team: Object.assign({}, team) });
                }
            });
            console.log("adding extra students in teams with team.students.length <MIN");
            let i = 0;
            while (i < teams.length && extraStudents.length > 0) {
                while (teams[i].students.length < MIN && extraStudents.length > 0) {
                    const st = extraStudents[extraStudents.length - 1];
                    studentAdded.push({ student: Object.assign({}, st), team: teams[i] });
                    teams[i].students.push(Object.assign({}, st));
                    extraStudents = extraStudents.filter(s => s.id !== st.id);
                }
                i++;
            }
            if (extraStudents.length > 0) {
                let i = 0;
                while (i < teams.length) {
                    while (teams[i].students.length < MAX && extraStudents.length > 0) {
                        const st = extraStudents[extraStudents.length - 1];
                        studentAdded.push({ student: Object.assign({}, st), team: teams[i] });
                        teams[i].students.push(st);
                        extraStudents = extraStudents.filter(s => s.id !== st.id);
                    }
                    i++;
                }
            }
            while (extraStudents.length > 0) {
                let newTeam = manager.getRepository(team_entity_1.TeamEntity).create({ students: [] });
                while (newTeam.students.length < MAX && extraStudents.length > 0) {
                    const st = extraStudents[extraStudents.length - 1];
                    newTeam.students.push(Object.assign({}, st));
                    extraStudents = extraStudents.filter(s => s.id !== st.id);
                }
                newTeams.push(newTeam);
            }
            return {
                INITIAL_EXTRA_STUDENTS,
                studentAdded,
                studentDeleted,
                newTeams,
            };
        }
        catch (err) {
            common_1.Logger.log(err, "UserService/completeTeams");
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async applyTeamsCompletion(userId, promotionId, applyTeamsCompletionPayload) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const user = await manager.getRepository(user_entity_1.UserEntity)
                .createQueryBuilder('user')
                .where("user.id = :userId", { userId })
                .andWhere("user.userType = :userType", { userType: user_entity_1.UserType.ADMIN })
                .getOne();
            const promotion = await manager.getRepository(promotion_entity_1.PromotionEntity)
                .createQueryBuilder('promotion')
                .where('promotion.id = :promotionId', { promotionId })
                .getOne();
            if (!user) {
                common_1.Logger.log("permission denied", "UserService/submitWishList");
                throw new common_1.HttpException("permission denied", common_1.HttpStatus.BAD_REQUEST);
            }
            if (!promotion) {
                common_1.Logger.log("promotion not found", "UserService/submitWishList");
                throw new common_1.HttpException("promotion not found", common_1.HttpStatus.BAD_REQUEST);
            }
            const teamsAddSt = {};
            applyTeamsCompletionPayload.addedStudents.forEach(({ teamId, studentId }) => {
                if (!teamsAddSt[teamId]) {
                    teamsAddSt[teamId] = [];
                }
                teamsAddSt[teamId].push(studentId);
            });
            const teamsDeleteSt = {};
            applyTeamsCompletionPayload.deletedStudents.forEach(({ teamId, studentId }) => {
                if (!teamsDeleteSt[teamId]) {
                    teamsDeleteSt[teamId] = [];
                }
                teamsDeleteSt[teamId].push(studentId);
            });
            await (0, typeorm_1.getConnection)().transaction(async (manager) => {
                const teamRepository = manager.getRepository(team_entity_1.TeamEntity);
                const studentRepository = manager.getRepository(student_entity_1.StudentEntity);
                Object.keys(teamsDeleteSt).forEach(async (teamId) => {
                    const studentsIds = teamsDeleteSt[teamId];
                    await studentRepository
                        .createQueryBuilder("student")
                        .where('student.id in (:...studentsIds)', { studentsIds })
                        .update({ team: null })
                        .execute();
                });
                Object.keys(teamsAddSt).forEach(async (teamId) => {
                    const studentsIds = teamsAddSt[teamId];
                    const team = await teamRepository
                        .createQueryBuilder('team')
                        .where('team.id = :teamId', { teamId })
                        .getOne();
                    if (!team) {
                        common_1.Logger.log("team not found when adding student to team", "TeamService/applyTeamsCompletion");
                        throw new common_1.HttpException("team not found when adding student to team", common_1.HttpStatus.BAD_REQUEST);
                    }
                    await studentRepository
                        .createQueryBuilder("student")
                        .where('student.id in (:...studentsIds)', { studentsIds })
                        .update({ team })
                        .execute();
                });
                await manager.getRepository(promotion_entity_1.PromotionEntity)
                    .createQueryBuilder('promotion')
                    .update()
                    .set({ allTeamsValidated: true })
                    .where('promotion.id = :promotionId', { promotionId })
                    .execute();
            });
            const teamRepository = manager.getRepository(team_entity_1.TeamEntity);
            const studentRepository = manager.getRepository(student_entity_1.StudentEntity);
            applyTeamsCompletionPayload.newTeams.forEach(async ({ students }) => {
                await (0, typeorm_1.getConnection)().transaction(async (manager) => {
                    const teamRepository = manager.getRepository(team_entity_1.TeamEntity);
                    const studentRepository = manager.getRepository(student_entity_1.StudentEntity);
                    const newTeam = teamRepository.create({ nickName: `team${uniqid()}`, promotion });
                    const newTeamDb = await teamRepository.save(newTeam);
                    const studentsIds = students.map(s => s.studentId);
                    await studentRepository
                        .createQueryBuilder('student')
                        .where('student.id in (:...studentsIds)', { studentsIds })
                        .update()
                        .set({ team: newTeamDb })
                        .execute();
                    const randomlyChoosenTeamLeaderId = students[Math.floor(Math.random() * (students.length - 1))].studentId;
                    const choosenStudent = await studentRepository
                        .createQueryBuilder('student')
                        .where('student.id = :studentId', { studentId: randomlyChoosenTeamLeaderId })
                        .getOne();
                    if (!choosenStudent) {
                        common_1.Logger.log("choosen team leader not found", "TeamService/applyTeamsCompletion");
                        throw new common_1.HttpException("choosen team leader not found", common_1.HttpStatus.BAD_REQUEST);
                    }
                    await teamRepository
                        .createQueryBuilder('team')
                        .where('team.id = :teamId', { teamId: newTeamDb.id })
                        .update()
                        .set({ teamLeader: choosenStudent })
                        .execute();
                });
            });
            return "success";
        }
        catch (err) {
            common_1.Logger.log(err, "TeamService/applyTeamsCompletion");
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
TeamService = __decorate([
    (0, common_1.Injectable)()
], TeamService);
exports.TeamService = TeamService;
//# sourceMappingURL=team.service.js.map