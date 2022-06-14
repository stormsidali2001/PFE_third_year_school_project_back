"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeCommitsService = void 0;
const common_1 = require("@nestjs/common");
const commit_document_entity_1 = require("../../core/entities/commit.document.entity");
const commit_entity_1 = require("../../core/entities/commit.entity");
const user_entity_1 = require("../../core/entities/user.entity");
const typeorm_1 = require("typeorm");
let ThemeCommitsService = class ThemeCommitsService {
    async getTeamCommits(userId, teamId) {
        try {
            const manager = (0, typeorm_1.getManager)();
            return await manager.getRepository(commit_entity_1.CommitEntity)
                .createQueryBuilder('commit')
                .where('commit.teamId = :teamId', { teamId })
                .orderBy("commit.createdAt", "DESC")
                .leftJoinAndSelect('commit.documents', 'documents')
                .leftJoinAndSelect('documents.type', 'type')
                .innerJoin('commit.team', 'team')
                .innerJoin('team.responsibleTeachers', 'responsibleTeachers')
                .innerJoin('responsibleTeachers.teacher', 'teacher')
                .andWhere('teacher.userId = :userId', { userId })
                .getMany();
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/getTeamsTeacherResponsibleFor');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAllCommitsDocs(userId, teamId) {
        try {
            const manager = (0, typeorm_1.getManager)();
            return await manager.getRepository(commit_document_entity_1.CommitDocumentEntity)
                .createQueryBuilder('document')
                .leftJoinAndSelect('document.type', 'type')
                .innerJoin('document.commit', 'commit')
                .where('commit.teamId = :teamId', { teamId })
                .innerJoin('commit.team', 'team')
                .innerJoin('team.responsibleTeachers', 'responsibleTeachers')
                .innerJoin('responsibleTeachers.teacher', 'teacher')
                .andWhere('teacher.userId = :userId', { userId })
                .getMany();
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/getTeamsTeacherResponsibleFor');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async validatedDocument(userId, documentIds) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const documents = await manager.getRepository(commit_document_entity_1.CommitDocumentEntity)
                .createQueryBuilder('document')
                .where('document.id  in  (:...documentIds)', { documentIds })
                .innerJoin('document.commit', 'commit')
                .innerJoin('commit.team', 'team')
                .innerJoin('team.responsibleTeachers', 'responsibleTeachers')
                .innerJoin('responsibleTeachers.teacher', 'teacher')
                .andWhere('teacher.userId = :userId', { userId })
                .getMany();
            if (documents.length < documentIds.length || documents.some(doc => doc.validated)) {
                common_1.Logger.error("Permission denied", 'UserService/getTeamsTeacherResponsibleFor');
                throw new common_1.HttpException("Permission denied", common_1.HttpStatus.BAD_REQUEST);
            }
            await manager.getRepository(commit_document_entity_1.CommitDocumentEntity)
                .createQueryBuilder()
                .update()
                .set({ validated: true })
                .where('commit_document.id  in  (:...documentIds)', { documentIds })
                .execute();
        }
        catch (err) {
            common_1.Logger.log(err, 'UserService/validateDocument');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAllDocsAdmin(userId, promotionId, teamId) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const user = await manager.getRepository(user_entity_1.UserEntity)
                .createQueryBuilder('user')
                .where('user.id = :userId', { userId })
                .andWhere('user.userType = :userType', { userType: user_entity_1.UserType.ADMIN })
                .getOne();
            if (!user) {
                common_1.Logger.error("perssion denied", 'UserService/getAllDocsAdmin');
                throw new common_1.HttpException("perssion denied", common_1.HttpStatus.BAD_REQUEST);
            }
            let query = manager.getRepository(commit_document_entity_1.CommitDocumentEntity)
                .createQueryBuilder('document')
                .where('document.validated = true')
                .leftJoinAndSelect('document.type', 'type')
                .innerJoinAndSelect('document.commit', 'commit')
                .innerJoinAndSelect('commit.team', 'team')
                .innerJoinAndSelect('team.promotion', 'promotion');
            if (promotionId !== 'all') {
                query = query
                    .andWhere('promotion.id = :promotionId', { promotionId });
            }
            if (teamId !== 'all') {
                query = query
                    .andWhere('team.id = :teamId', { teamId });
            }
            return await query.getMany();
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/getAllDocsAdmin');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
ThemeCommitsService = __decorate([
    (0, common_1.Injectable)()
], ThemeCommitsService);
exports.ThemeCommitsService = ThemeCommitsService;
//# sourceMappingURL=theme.commits.service.js.map