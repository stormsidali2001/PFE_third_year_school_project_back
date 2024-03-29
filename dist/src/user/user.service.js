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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const Notification_entity_1 = require("../core/entities/Notification.entity");
const student_entity_1 = require("../core/entities/student.entity");
const team_entity_1 = require("../core/entities/team.entity");
const user_entity_1 = require("../core/entities/user.entity");
const typeorm_1 = require("typeorm");
const schedule_1 = require("@nestjs/schedule");
const socket_service_1 = require("../socket/socket.service");
const teacher_entity_1 = require("../core/entities/teacher.entity");
const admin_entity_1 = require("../core/entities/admin.entity");
const config_entity_1 = require("../core/entities/config.entity");
const theme_entity_1 = require("../core/entities/theme.entity");
const promotion_entity_1 = require("../core/entities/promotion.entity");
const wish_entity_1 = require("../core/entities/wish.entity");
const document_types_entity_1 = require("../core/entities/document-types.entity");
const salle_entity_1 = require("../core/entities/salle.entity");
let UserService = class UserService {
    constructor(schedulerRegistry, socketService) {
        this.schedulerRegistry = schedulerRegistry;
        this.socketService = socketService;
    }
    async getUserInfo(userId) {
        const manager = (0, typeorm_1.getManager)();
        const userRepository = manager.getRepository(user_entity_1.UserEntity);
        try {
            const user = await userRepository.createQueryBuilder('user')
                .where('user.id = :userId', { userId })
                .getOne();
            if (!user) {
                common_1.Logger.log("user not found", "userService/getUserInfo");
                throw new common_1.HttpException("user not found", common_1.HttpStatus.FORBIDDEN);
            }
            let entity;
            if (user.userType === user_entity_1.UserType.STUDENT) {
                entity = await (0, typeorm_1.getManager)().getRepository(student_entity_1.StudentEntity).createQueryBuilder('student')
                    .where('student.userId = :userId', { userId })
                    .leftJoinAndSelect('student.team', 'team')
                    .leftJoinAndSelect('team.teamLeader', 'teamLeader')
                    .leftJoinAndSelect('student.promotion', 'promotion')
                    .getOne();
            }
            else if (user.userType === user_entity_1.UserType.ADMIN) {
                entity = await (0, typeorm_1.getManager)().getRepository(admin_entity_1.AdminEntity).createQueryBuilder('admin')
                    .where('admin.userId = :userId', { userId: user.id })
                    .getOne();
            }
            else if (user.userType === user_entity_1.UserType.TEACHER) {
                entity = await (0, typeorm_1.getManager)().getRepository(teacher_entity_1.TeacherEntity).createQueryBuilder('teacher')
                    .where('teacher.userId = :userId', { userId: user.id })
                    .getOne();
            }
            else if (user.userType === user_entity_1.UserType.ENTERPRISE) {
            }
            const responseObj = {
                userType: user.userType,
                email: user.email,
                [`${user.userType}`]: Object.assign({}, entity)
            };
            return responseObj;
        }
        catch (err) {
            common_1.Logger.error(err, "userService/getUserInfo");
            throw new common_1.HttpException(err, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async _sendNotficationStudent(studentId, description) {
        const manager = (0, typeorm_1.getManager)();
        const studentRepository = manager.getRepository(student_entity_1.StudentEntity);
        const student = await studentRepository.createQueryBuilder('student')
            .where('student.id = :studentId', { studentId })
            .leftJoinAndSelect('student.user', 'user')
            .getOne();
        if (!student) {
            common_1.Logger.error("student not found", 'UserService/sendNotfication');
            throw new common_1.HttpException("student not found", common_1.HttpStatus.BAD_REQUEST);
        }
        const notificationRepository = manager.getRepository(Notification_entity_1.NotificationEntity);
        const notification = notificationRepository.create({ description, user: student.user, seen: false });
        await notificationRepository.save(notification);
        const socket = this.socketService.socket;
        socket.to(student.user.id).emit("new_notification", notification);
        return `notification sent with success to: ${student.firstName + ' ' + student.lastName}`;
    }
    async _sendTeamNotfication(teamId, description, expectStudentId, expectMessage) {
        const manager = (0, typeorm_1.getManager)();
        const teamRepository = manager.getRepository(team_entity_1.TeamEntity);
        const team = await teamRepository.createQueryBuilder('team')
            .where('team.id = :teamId', { teamId })
            .leftJoinAndSelect('team.students', 'student')
            .leftJoinAndSelect('student.user', 'user')
            .getOne();
        if (!team) {
            common_1.Logger.error("the student is not a member in a team", 'UserService/sendTeamNotfication');
            throw new common_1.HttpException("the student is not a member in a team", common_1.HttpStatus.BAD_REQUEST);
        }
        const notificationRepository = manager.getRepository(Notification_entity_1.NotificationEntity);
        const notifications = [];
        for (let student of team.students) {
            if (expectStudentId && student.id === expectStudentId) {
                if (expectMessage) {
                    const notification = notificationRepository.create({ description: expectMessage, user: student.user, seen: false });
                    notifications.push(notification);
                }
                continue;
            }
            const notification = notificationRepository.create({ description, user: student.user, seen: false });
            notifications.push(notification);
        }
        await notificationRepository.save(notifications);
        const socket = this.socketService.socket;
        notifications.forEach((nf, index) => {
            common_1.Logger.error(`notification sent ${index}`, "Notification");
            socket.to(nf.user.id).emit("new_notification", nf);
        });
        return `notification sent with success to team: ${team.nickName} members`;
    }
    async _sendNotfication(userId, description) {
        const manager = (0, typeorm_1.getManager)();
        const userRepository = manager.getRepository(user_entity_1.UserEntity);
        const user = await userRepository.createQueryBuilder('user')
            .where('user.id = :userId', { userId })
            .getOne();
        if (!user) {
            common_1.Logger.error("user not found", 'UserService/sendNotfication');
            throw new common_1.HttpException("user not found", common_1.HttpStatus.BAD_REQUEST);
        }
        const notificationRepository = manager.getRepository(Notification_entity_1.NotificationEntity);
        const notification = notificationRepository.create({ description, user, seen: false });
        await notificationRepository.save(notification);
        const socket = this.socketService.socket;
        common_1.Logger.error(`emit to ${userId}  event new_notification`, "debugggggg");
        socket.to(userId).emit("new_notification", notification);
        return `notification sent with `;
    }
    async _sendNotificationToAdmins(admins, description) {
        const manager = (0, typeorm_1.getManager)();
        const notifications = [];
        const notificationRepository = manager.getRepository(Notification_entity_1.NotificationEntity);
        admins.forEach(admin => {
            const notification = notificationRepository.create({ user: admin.user, description });
            notifications.push(notification);
        });
        await notificationRepository.save(notifications);
        notifications.forEach(nf => {
            const socket = this.socketService.socket;
            socket.to(nf.user.id).emit("new_notification", nf);
        });
    }
    async getLastNotifications(userId, number = undefined) {
        try {
            const manager = (0, typeorm_1.getManager)();
            common_1.Logger.error(`notifications ${userId}`, 'UserService/getNotifications');
            const notificationRepository = manager.getRepository(Notification_entity_1.NotificationEntity);
            const notifications = await notificationRepository.createQueryBuilder('notification')
                .innerJoin('notification.user', 'user')
                .where('user.id = :userId', { userId })
                .orderBy('notification.createdAt', "DESC")
                .getMany();
            const totalNotificationCount = await notificationRepository.createQueryBuilder('notification')
                .innerJoin('notification.user', 'user')
                .where('user.id = :userId', { userId })
                .getCount();
            return { notifications, totalNotificationCount };
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/getNotifications');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getStudents() {
        try {
            const manager = (0, typeorm_1.getManager)();
            const studentRepository = manager.getRepository(student_entity_1.StudentEntity);
            const students = await studentRepository.createQueryBuilder('students')
                .leftJoinAndSelect('students.promotion', 'promotion')
                .getMany();
            return students;
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/getStudents');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async deleteStudent(studentId) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const studentRepository = manager.getRepository(student_entity_1.StudentEntity);
            await studentRepository.createQueryBuilder('students')
                .delete()
                .where('student.id = :studentId', { studentId }).execute();
            return "deleted!!";
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/deleteStudent');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async editStudent(studentId, data) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const studentRepository = manager.getRepository(student_entity_1.StudentEntity);
            await studentRepository.createQueryBuilder('students')
                .update()
                .set(data)
                .where('students.id = :studentId', { studentId }).execute();
            return "updated !!";
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/editStudent');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getStudentInfos(studentId) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const student = await manager.getRepository(student_entity_1.StudentEntity)
                .createQueryBuilder('student')
                .where("student.id = :studentId", { studentId })
                .leftJoinAndSelect('student.promotion', 'promotion')
                .leftJoinAndSelect('student.team', 'team')
                .leftJoinAndSelect('student.user', 'user')
                .getOne();
            delete student.user.password;
            delete student.user.id;
            return student;
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/GetStudentInfos');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getTeachers() {
        try {
            const manager = (0, typeorm_1.getManager)();
            const teacherRepository = manager.getRepository(teacher_entity_1.TeacherEntity);
            const teachers = await teacherRepository.createQueryBuilder('teachers')
                .getMany();
            return teachers;
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/getTeachers');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getTeacher(teacherId) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const teacherRepository = manager.getRepository(teacher_entity_1.TeacherEntity);
            const teacher = await teacherRepository.createQueryBuilder('teacher')
                .leftJoinAndSelect("teacher.user", "user")
                .where("teacher.id = :teacherId", { teacherId })
                .getOne();
            delete teacher.user.password;
            return teacher;
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/getTeachers');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async deleteTeacher(teacherId) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const teacherRepository = manager.getRepository(teacher_entity_1.TeacherEntity);
            await teacherRepository.createQueryBuilder()
                .delete()
                .where('teacher.id = :teacherId', { teacherId }).execute();
            return "deleted!!";
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/deleteTeacher');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async editTeacher(teacherId, data) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const teacherRepository = manager.getRepository(teacher_entity_1.TeacherEntity);
            await teacherRepository.createQueryBuilder('teachers')
                .update()
                .set(data)
                .where('teachers.id = :teacherId', { teacherId }).execute();
            return "updated !!";
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/editTeacher');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async sendWishList(userId, promotionId) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const user = manager.getRepository(user_entity_1.UserEntity)
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
            if (promotion.wishListSent) {
                common_1.Logger.log("vous avez deja envoyée la fiche de voeux a cette promotion", "UserService/submitWishList");
                throw new common_1.HttpException("vous avez deja envoyée la fiche de voeux a cette promotion", common_1.HttpStatus.BAD_REQUEST);
            }
            if (!promotion.allTeamsValidated) {
                common_1.Logger.log("les equipes de la promotion sont non validés", "UserService/submitWishList");
                throw new common_1.HttpException("les equipes de la promotion sont non validés", common_1.HttpStatus.BAD_REQUEST);
            }
            return await manager.getRepository(promotion_entity_1.PromotionEntity)
                .createQueryBuilder('promotion')
                .update()
                .set({ wishListSent: true })
                .where('promotion.id = :promotionId', { promotionId })
                .execute();
        }
        catch (err) {
            common_1.Logger.log(err, "UserService/submitWishList");
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async submitWishList(userId, wishList) {
        try {
            const manager = (0, typeorm_1.getManager)();
            common_1.Logger.error(wishList, 'DEbuuuug');
            const student = await manager.getRepository(student_entity_1.StudentEntity)
                .createQueryBuilder('student')
                .where("student.userId = :userId", { userId })
                .innerJoinAndSelect('student.team', 'team')
                .innerJoinAndSelect('team.teamLeader', 'teamLeader')
                .andWhere('teamLeader.id = student.id')
                .leftJoinAndSelect('student.promotion', 'promotion')
                .leftJoinAndSelect('promotion.themes', 'themes')
                .andWhere('themes.validated = true')
                .getOne();
            if (!student) {
                common_1.Logger.error("Permission denied", 'UserService/submitWishList');
                throw new common_1.HttpException("Permission denied", common_1.HttpStatus.BAD_REQUEST);
            }
            const wish = await manager.getRepository(wish_entity_1.WishEntity)
                .createQueryBuilder('wish')
                .where('wish.teamId IS NOT NULL and wish.teamId = :teamId', { teamId: student.team.id })
                .getOne();
            if (wish) {
                common_1.Logger.error("votre equipe a deja envoyer ses voeux", 'UserService/submitWishList');
                throw new common_1.HttpException("your team already submitted the wish list", common_1.HttpStatus.BAD_REQUEST);
            }
            const { wishes } = wishList;
            if ((wishes === null || wishes === void 0 ? void 0 : wishes.length) == 0) {
                common_1.Logger.error("wishes not found", 'UserService/submitWishList');
                throw new common_1.HttpException("wishes not found", common_1.HttpStatus.BAD_REQUEST);
            }
            const newWishList = [];
            await (0, typeorm_1.getConnection)().transaction(async (manager) => {
                wishes.forEach(async (el, index) => {
                    const theme = await manager.getRepository(theme_entity_1.ThemeEntity)
                        .createQueryBuilder("theme")
                        .where("theme.id = :themeId", { themeId: el.themeId })
                        .andWhere('theme.validated = true')
                        .getOne();
                    if (!theme) {
                        common_1.Logger.error("theme not found", 'UserService/submitWishList');
                        throw new common_1.HttpException("theme not found", common_1.HttpStatus.BAD_REQUEST);
                    }
                    newWishList.push({
                        order: el.order,
                        team: student.team,
                        theme: theme
                    });
                });
            });
            await manager.getRepository(wish_entity_1.WishEntity)
                .save(newWishList);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/submitWishList');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getTeams(promotionId) {
        try {
            const manager = (0, typeorm_1.getManager)();
            let query = manager.getRepository(team_entity_1.TeamEntity)
                .createQueryBuilder('team')
                .leftJoinAndSelect('team.givenTheme', 'givenTheme')
                .loadRelationCountAndMap('team.membersCount', 'team.students')
                .leftJoinAndSelect('team.students', 'students')
                .leftJoinAndSelect('team.promotion', 'promotion');
            if (promotionId !== 'all') {
                query = query.where('promotion.id = :promotionId', { promotionId });
            }
            const teams = await query.getMany();
            return teams.map(({ nickName, givenTheme, membersCount, id, promotion, peutSoutenir, students }) => {
                common_1.Logger.error(nickName, promotion, "debug");
                let sum = 0;
                students.forEach(el => {
                    sum += el.moy;
                });
                return {
                    id,
                    pseudo: nickName,
                    theme: givenTheme,
                    nombre: membersCount,
                    promotion: promotion.name,
                    complete: membersCount >= promotion.minMembersInTeam && membersCount <= promotion.maxMembersInTeam,
                    peut_soutenir: peutSoutenir,
                    moyenne: sum / students.length
                };
            });
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/getTeams');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getTeam(teamId) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const team = await manager.getRepository(team_entity_1.TeamEntity)
                .createQueryBuilder('team')
                .where('team.id = :teamId', { teamId })
                .leftJoinAndSelect('team.givenTheme', 'givenTheme')
                .leftJoinAndSelect('team.students', 'members')
                .leftJoinAndSelect('team.promotion', 'promotion')
                .leftJoinAndSelect('team.teamLeader', 'leader')
                .getOne();
            const { id, nickName, givenTheme, students, promotion, teamLeader, peutSoutenir } = team;
            let sum = 0;
            students.forEach(el => {
                sum += el.moy;
            });
            return {
                id,
                pseudo: nickName,
                theme: givenTheme,
                members: students,
                promotion: promotion,
                complete: students.length >= promotion.minMembersInTeam && students.length <= promotion.maxMembersInTeam,
                teamLeader,
                peut_soutenir: peutSoutenir,
                moyenne: sum / students.length
            };
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/getTeam');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async createNewConfig(key, value) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const sql = manager.getRepository(config_entity_1.ConfigEntity)
                .createQueryBuilder()
                .insert()
                .values({ key, value }).getSql();
            await manager.getRepository(config_entity_1.ConfigEntity)
                .createQueryBuilder()
                .insert()
                .values({ key, value })
                .execute();
            common_1.Logger.error(sql, "userService/createNewConfig");
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/createNewConfig');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async createNewPromotion(name, documentTypes) {
        try {
            const manager = (0, typeorm_1.getManager)();
            await (0, typeorm_1.getConnection)().transaction(async (manager) => {
                const promotion = manager.getRepository(promotion_entity_1.PromotionEntity).create({ name });
                await manager.getRepository(promotion_entity_1.PromotionEntity)
                    .createQueryBuilder()
                    .insert()
                    .values(promotion)
                    .execute();
                let docTypes = [];
                const docType = manager.getRepository(document_types_entity_1.DocumentTypeEntity).create({ name: 'autres', promotion });
                docTypes.push(docType);
                for (let k in documentTypes) {
                    const docnName = documentTypes[k];
                    const docType = manager.getRepository(document_types_entity_1.DocumentTypeEntity).create({ name: docnName, promotion });
                    docTypes.push(docType);
                }
                await manager.getRepository(document_types_entity_1.DocumentTypeEntity)
                    .save(docTypes);
            });
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/createNewPromotion');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAllPromotions() {
        try {
            const manager = (0, typeorm_1.getManager)();
            return await manager.getRepository(promotion_entity_1.PromotionEntity)
                .createQueryBuilder()
                .getMany();
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/getAllPromotions');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getPromotionDocumentTypes(userId) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const student = await manager.getRepository(student_entity_1.StudentEntity)
                .createQueryBuilder('student')
                .where('student.userId = :userId', { userId })
                .leftJoinAndSelect('student.promotion', 'promotion')
                .leftJoinAndSelect('promotion.documentTypes', 'documentTypes')
                .getOne();
            if (!student) {
                common_1.Logger.error("permession denied", 'UserService/getPromotionDocumentTypes');
                throw new common_1.HttpException("permession denied", common_1.HttpStatus.BAD_REQUEST);
            }
            return student.promotion.documentTypes;
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/getPromotionDocumentTypes');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getSalles() {
        try {
            const manager = (0, typeorm_1.getManager)();
            const salles = await manager.getRepository(salle_entity_1.SalleEntity)
                .createQueryBuilder('salles')
                .getMany();
            return salles;
        }
        catch (err) {
            common_1.Logger.log(err, 'UserService/getSalles');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async careateSalle(name) {
        try {
            const manager = (0, typeorm_1.getManager)();
            await manager.getRepository(salle_entity_1.SalleEntity)
                .createQueryBuilder('salle')
                .insert()
                .values({ name })
                .execute();
        }
        catch (err) {
            common_1.Logger.log(err, 'UserService/getSalles');
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
};
__decorate([
    (0, common_1.Post)('getSalles'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserService.prototype, "getSalles", null);
UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [schedule_1.SchedulerRegistry,
        socket_service_1.SocketService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map