"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeAssignementService = void 0;
const common_1 = require("@nestjs/common");
const promotion_entity_1 = require("../../core/entities/promotion.entity");
const team_entity_1 = require("../../core/entities/team.entity");
const theme_entity_1 = require("../../core/entities/theme.entity");
const user_entity_1 = require("../../core/entities/user.entity");
const wish_entity_1 = require("../../core/entities/wish.entity");
const typeorm_1 = require("typeorm");
let ThemeAssignementService = class ThemeAssignementService {
    async asignThemesToTeams(userId, promotionId, method) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const user = manager.getRepository(user_entity_1.UserEntity)
                .createQueryBuilder('user')
                .where("user.id = :userId", { userId })
                .andWhere("user.userType = :userType", { userType: user_entity_1.UserType.ADMIN })
                .getOne();
            if (!user) {
                common_1.Logger.log("permission denied", "ThemeAssignementService/asignThemeToTeams");
                throw new common_1.HttpException("permission denied", common_1.HttpStatus.BAD_REQUEST);
            }
            const promotion = await manager.getRepository(promotion_entity_1.PromotionEntity)
                .createQueryBuilder("promotion")
                .where("promotion.id = :promotionId", { promotionId })
                .getOne();
            if (!promotion) {
                common_1.Logger.log("promotion not found", "ThemeAssignementService/asignThemeToTeams");
                throw new common_1.HttpException("promotion not found", common_1.HttpStatus.BAD_REQUEST);
            }
            const Themes = await manager.getRepository(theme_entity_1.ThemeEntity)
                .createQueryBuilder('theme')
                .leftJoinAndSelect('theme.promotion', 'promotion')
                .where('promotion.id = :promotionId', { promotionId })
                .andWhere('theme.validated = true')
                .leftJoinAndSelect('theme.wishes', 'wish')
                .leftJoinAndSelect('wish.team', 'team')
                .orderBy('wish.order', 'ASC')
                .leftJoinAndSelect('team.students', 'student')
                .getMany();
            if (Themes.length === 0) {
                common_1.Logger.log("there are no themes in the promotion yet", "ThemeAssignementService/asignThemeToTeams");
                throw new common_1.HttpException("there are no themes in the promotion yet", common_1.HttpStatus.BAD_REQUEST);
            }
            if (!promotion.allTeamsValidated) {
                common_1.Logger.log("teams are not completed and validated by the admin", "ThemeAssignementService/asignThemeToTeams");
                throw new common_1.HttpException("teams are not completed and validated by the admin", common_1.HttpStatus.BAD_REQUEST);
            }
            const teamsInPromotionNum = await manager.getRepository(team_entity_1.TeamEntity)
                .createQueryBuilder('team')
                .where('team.promotionId = :promotionId', { promotionId })
                .getCount();
            if (teamsInPromotionNum > Themes.length * promotion.maxTeamForTheme) {
                common_1.Logger.log(`vous devez ajouter plus de theme : nombre d'equipe  = ${teamsInPromotionNum} > maximum de place dans les themes :${Themes.length * promotion.maxTeamForTheme}`, "ThemeAssignementService/asignThemeToTeams");
                throw new common_1.HttpException(`vous devez ajouter plus de theme : nombre d'equipe  = ${teamsInPromotionNum} > maximum de place dans les themes :${Themes.length * promotion.maxTeamForTheme}`, common_1.HttpStatus.BAD_REQUEST);
            }
            const teams = await manager.getRepository(team_entity_1.TeamEntity)
                .createQueryBuilder('team')
                .where(qb => `team.id not in ${qb.subQuery()
                .select('wish.teamId').from(wish_entity_1.WishEntity, 'wish').getQuery()}`)
                .getMany();
            if (teams.length > 0) {
                const newWishes = [];
                let newThemes = JSON.parse(JSON.stringify(Themes));
                newThemes = newThemes.map(nth => {
                    const newNth = Object.assign({}, nth);
                    delete newNth.promotion;
                    delete newNth.wishes;
                    delete newNth.team;
                    return newNth;
                });
                teams.forEach(team => {
                    newThemes.forEach((th, index) => {
                        newWishes.push({
                            team,
                            order: index,
                            theme: th
                        });
                    });
                });
                await manager.getRepository(wish_entity_1.WishEntity)
                    .save(newWishes);
            }
            const af_team_to_th = {};
            const ignoreTeam = new Set();
            Themes.forEach(theme => {
                af_team_to_th[theme.id] = [];
                const { maxTeamForTheme } = theme.promotion;
                let wishes = theme.wishes;
                if (method === 'moy') {
                    wishes = theme.wishes.sort((a, b) => {
                        const getMoyTeam = team => {
                            let sum = 0;
                            team.students.forEach(st => {
                                sum += st.moy;
                            });
                            return sum / team.students.length;
                        };
                        return (a.order === b.order) ? getMoyTeam(a.team) - getMoyTeam(b.team) : 0;
                    });
                }
                else if (method === 'random') {
                    wishes = theme.wishes.sort((a, b) => {
                        return (a.order === b.order) ? 0.5 - Math.random() : 0;
                    });
                }
                else if (method === 'time') {
                    wishes = theme.wishes.sort((a, b) => {
                        return (a.order === b.order) ? (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) : 0;
                    });
                }
                for (let k in wishes) {
                    const wish = wishes[k];
                    const { team, order } = wish;
                    if (ignoreTeam.has(team.id)) {
                        continue;
                    }
                    if (af_team_to_th[theme.id].length < maxTeamForTheme) {
                        console.log("____________________");
                        console.log("maxTeamForTheme:", maxTeamForTheme);
                        console.log("af_team_to_th[theme.id].length:", af_team_to_th[theme.id].length);
                        af_team_to_th[theme.id].push(team);
                        ignoreTeam.add(team.id);
                    }
                }
            });
            return Object.keys(af_team_to_th).map(el => {
                const teams = af_team_to_th[el].map(team => {
                    const newTeam = Object.assign({}, team);
                    delete newTeam.students;
                    return newTeam;
                });
                const { title, id } = Themes.find(th => th.id === el);
                return {
                    theme: {
                        id,
                        title
                    },
                    teams
                };
            });
        }
        catch (err) {
            common_1.Logger.log(err, "UserService/asignThemeToTeams");
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async applyThemesToTeamsAssignements(userId, data) {
        try {
            if (data.themeToTeam.length === 0) {
                common_1.Logger.log("Error payload is empty", "ThemeAssignementService/applyThemesToTeamsAssignements");
                throw new common_1.HttpException("Error payload is empty", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            const manager = (0, typeorm_1.getManager)();
            const user = manager.getRepository(user_entity_1.UserEntity)
                .createQueryBuilder('user')
                .where("user.id = :userId", { userId })
                .andWhere("user.userType = :userType", { userType: user_entity_1.UserType.ADMIN })
                .getOne();
            if (!user) {
                common_1.Logger.log("permission denied", "UserService/applyThemesToTeamsAssignements");
                throw new common_1.HttpException("permission denied", common_1.HttpStatus.BAD_REQUEST);
            }
            let fetchTeamIds = [];
            let themeIds = [];
            console.log(data, '77777777');
            for (let k in data.themeToTeam) {
                const el = data.themeToTeam[k];
                const { idTheme, teamIds } = el;
                console.log(el, '55555555555');
                themeIds.push(idTheme);
                fetchTeamIds = [...fetchTeamIds, ...teamIds];
            }
            const themes = await manager.getRepository(theme_entity_1.ThemeEntity)
                .createQueryBuilder('theme')
                .where('theme.id IN (:...themeIds)', { themeIds })
                .getMany();
            const teams = await manager.getRepository(team_entity_1.TeamEntity)
                .createQueryBuilder('team')
                .leftJoinAndSelect('team.promotion', 'promotion')
                .where('team.id IN (:...fetchTeamIds)', { fetchTeamIds })
                .getMany();
            if (themes.length != themeIds.length) {
                common_1.Logger.error("error in theme ids", 'UserService/applyThemesToTeamsAssignements');
                throw new common_1.HttpException("error in theme ids", common_1.HttpStatus.BAD_REQUEST);
            }
            if (teams.length !== fetchTeamIds.length) {
                common_1.Logger.error("error in team ids", 'UserService/applyThemesToTeamsAssignements');
                throw new common_1.HttpException("error in team ids", common_1.HttpStatus.BAD_REQUEST);
            }
            if (themes.length === 0) {
                common_1.Logger.error("themes are not enough", 'UserService/applyThemesToTeamsAssignements');
                throw new common_1.HttpException("themes are not enough", common_1.HttpStatus.BAD_REQUEST);
            }
            if (teams.length === 0) {
                common_1.Logger.error("teams are not enough", 'UserService/applyThemesToTeamsAssignements');
                throw new common_1.HttpException("teams are not enough", common_1.HttpStatus.BAD_REQUEST);
            }
            await (0, typeorm_1.getConnection)().transaction(async (manager) => {
                data.themeToTeam.forEach(async ({ idTheme, teamIds }) => {
                    const theme = themes.find(el => el.id === idTheme);
                    teamIds.forEach(async (teamId) => {
                        await manager.getRepository(team_entity_1.TeamEntity)
                            .createQueryBuilder('team')
                            .update()
                            .set({ givenTheme: theme })
                            .where('team.id = :teamId', { teamId })
                            .execute();
                    });
                });
                await manager.getRepository(promotion_entity_1.PromotionEntity)
                    .createQueryBuilder('promotion')
                    .update()
                    .set({ themesAssignedToTeams: true })
                    .where('promotion.id = :promotionId', { promotionId: teams[0].promotion.id })
                    .execute();
            });
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/applyThemesToTeamsAssignements');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
ThemeAssignementService = __decorate([
    (0, common_1.Injectable)()
], ThemeAssignementService);
exports.ThemeAssignementService = ThemeAssignementService;
//# sourceMappingURL=theme.assignement.service.js.map