"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeService = void 0;
const common_1 = require("@nestjs/common");
const entreprise_entity_1 = require("../../core/entities/entreprise.entity");
const promotion_entity_1 = require("../../core/entities/promotion.entity");
const teacher_entity_1 = require("../../core/entities/teacher.entity");
const theme_document_entity_1 = require("../../core/entities/theme.document.entity");
const theme_entity_1 = require("../../core/entities/theme.entity");
const user_entity_1 = require("../../core/entities/user.entity");
const typeorm_1 = require("typeorm");
let ThemeService = class ThemeService {
    async createThemeSuggestion(userId, title, description, documents, promotionId) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const user = await manager.getRepository(user_entity_1.UserEntity)
                .createQueryBuilder('user')
                .where('user.id = :userId', { userId })
                .getOne();
            if (!user) {
                common_1.Logger.error("user not found", 'UserService/createThemeSuggestion');
                throw new common_1.HttpException("user not found", common_1.HttpStatus.BAD_REQUEST);
            }
            const { userType } = user;
            if (userType !== user_entity_1.UserType.TEACHER && userType !== user_entity_1.UserType.ENTERPRISE) {
                common_1.Logger.error("you need to be either a teacher or an entreprise to submit a theme suggestion ", 'UserService/createThemeSuggestion');
                throw new common_1.HttpException("you need to be either a teacher or an entreprise to submit a theme suggestion  ", common_1.HttpStatus.BAD_REQUEST);
            }
            const promotion = await manager.getRepository(promotion_entity_1.PromotionEntity)
                .createQueryBuilder('promotion')
                .where('promotion.id = :promotionId', { promotionId })
                .getOne();
            if (!promotion) {
                common_1.Logger.error("promotion not found", 'UserService/createThemeSuggestion');
                throw new common_1.HttpException("promotion not found", common_1.HttpStatus.BAD_REQUEST);
            }
            let themeSuggestion;
            const themeRepository = manager.getRepository(theme_entity_1.ThemeEntity);
            if (userType === user_entity_1.UserType.TEACHER) {
                const teacher = await manager.getRepository(teacher_entity_1.TeacherEntity)
                    .createQueryBuilder('teacher')
                    .where('teacher.userId = :userId', { userId })
                    .getOne();
                themeSuggestion = themeRepository.create({ title, description, suggestedByTeacher: teacher, promotion });
            }
            else if (userType === user_entity_1.UserType.ENTERPRISE) {
                const entreprise = await manager.getRepository(entreprise_entity_1.EntrepriseEntity)
                    .createQueryBuilder('entrprise')
                    .where('entrprise.userId = :userId', { userId })
                    .getOne();
                themeSuggestion = themeRepository.create({ title, description, suggestedByEntreprise: entreprise, promotion });
            }
            await themeRepository
                .createQueryBuilder()
                .insert()
                .values(themeSuggestion)
                .execute();
            const themeDocumentRepository = manager.getRepository(theme_document_entity_1.ThemeDocumentEntity);
            const themeSuggestionsDocs = [];
            documents.forEach(doc => {
                const themeSugDoc = themeDocumentRepository.create({ name: doc.name, url: doc.url, theme: themeSuggestion });
                themeSuggestionsDocs.push(themeSugDoc);
            });
            await themeDocumentRepository.createQueryBuilder()
                .insert()
                .values(themeSuggestionsDocs)
                .execute();
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/createThemeSuggestion');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getThemeSuggestions(promotionId) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const themeSuggestions = await manager.getRepository(theme_entity_1.ThemeEntity)
                .createQueryBuilder('theme')
                .where('theme.promotionId = :promotionId', { promotionId })
                .leftJoinAndSelect('theme.suggestedByTeacher', 'suggestedByTeacher', 'theme.suggestedByTeacher IS NOT NULL')
                .leftJoinAndSelect('theme.suggestedByEntreprise', 'suggestedByEntreprise', 'theme.suggestedByEntreprise IS NOT NULL')
                .getMany();
            return themeSuggestions;
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/getThemeSuggestions');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAllThemeSuggestions() {
        try {
            const manager = (0, typeorm_1.getManager)();
            const themeSuggestions = await manager.getRepository(theme_entity_1.ThemeEntity)
                .createQueryBuilder('theme')
                .leftJoinAndSelect('theme.suggestedByTeacher', 'suggestedByTeacher', 'theme.suggestedByTeacher IS NOT NULL')
                .leftJoinAndSelect('theme.suggestedByEntreprise', 'suggestedByEntreprise', 'theme.suggestedByEntreprise IS NOT NULL')
                .leftJoinAndSelect('theme.promotion', 'promotion')
                .getMany();
            return themeSuggestions;
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/getAllThemeSuggestions');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getThemeSuggestion(themeId) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const themeSuggestion = await manager.getRepository(theme_entity_1.ThemeEntity)
                .createQueryBuilder('theme')
                .where("theme.id = :themeId", { themeId })
                .leftJoinAndSelect('theme.suggestedByTeacher', 'suggestedByTeacher')
                .leftJoinAndSelect('theme.suggestedByEntreprise', 'suggestedByEntreprise')
                .leftJoinAndSelect('theme.documents', 'documents')
                .leftJoinAndSelect('theme.promotion', 'promotion')
                .getOne();
            return themeSuggestion;
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/getThemeSuggestion');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async validateThemeSuggestion(userId, themeId) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const user = await manager.getRepository(user_entity_1.UserEntity)
                .createQueryBuilder('user')
                .where('user.userType = :userType', { userType: user_entity_1.UserType.ADMIN })
                .andWhere('user.id = :userId', { userId })
                .getOne();
            if (!user) {
                common_1.Logger.error("permession denied", 'UserService/validateThemeSuggestion');
                throw new common_1.HttpException("permession denied", common_1.HttpStatus.BAD_REQUEST);
            }
            await manager.getRepository(theme_entity_1.ThemeEntity)
                .createQueryBuilder('theme')
                .update()
                .set({ validated: true })
                .where('theme.id = :themeId', { themeId })
                .execute();
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/validateThemeSuggestion');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAllThemes() {
        try {
            const manager = (0, typeorm_1.getManager)();
            const themeSuggestions = await manager.getRepository(theme_entity_1.ThemeEntity)
                .createQueryBuilder('theme')
                .where('theme.validated = true')
                .leftJoinAndSelect('theme.suggestedByTeacher', 'suggestedByTeacher', 'theme.suggestedByTeacher IS NOT NULL')
                .leftJoinAndSelect('theme.suggestedByEntreprise', 'suggestedByEntreprise', 'theme.suggestedByEntreprise IS NOT NULL')
                .leftJoinAndSelect('theme.promotion', 'promotion')
                .getMany();
            return themeSuggestions;
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/getAllThemeSuggestions');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getThemes(promotionId) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const themeSuggestions = await manager.getRepository(theme_entity_1.ThemeEntity)
                .createQueryBuilder('theme')
                .where('theme.validated = true')
                .andWhere('theme.promotionId = :promotionId', { promotionId })
                .leftJoinAndSelect('theme.suggestedByTeacher', 'suggestedByTeacher', 'theme.suggestedByTeacher IS NOT NULL')
                .leftJoinAndSelect('theme.suggestedByEntreprise', 'suggestedByEntreprise', 'theme.suggestedByEntreprise IS NOT NULL')
                .getMany();
            return themeSuggestions;
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/getThemes');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getTheme(themeId) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const theme = await manager.getRepository(theme_entity_1.ThemeEntity)
                .createQueryBuilder('theme')
                .where("theme.id = :themeId", { themeId })
                .leftJoinAndSelect('theme.suggestedByTeacher', 'suggestedByTeacher')
                .leftJoinAndSelect('theme.suggestedByEntreprise', 'suggestedByEntreprise')
                .leftJoinAndSelect('theme.documents', 'documents')
                .leftJoinAndSelect('theme.promotion', 'promotion')
                .leftJoinAndSelect('theme.teams', 'teams')
                .leftJoinAndSelect('theme.encadrement', 'encadrement')
                .leftJoinAndSelect('encadrement.teacher', 'teacher')
                .leftJoinAndSelect('teacher.teamsInCharge', 'teamsInCharge')
                .leftJoinAndSelect('teamsInCharge.team', 'team')
                .getOne();
            return theme;
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/getTheme');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
ThemeService = __decorate([
    (0, common_1.Injectable)()
], ThemeService);
exports.ThemeService = ThemeService;
//# sourceMappingURL=theme.service.js.map