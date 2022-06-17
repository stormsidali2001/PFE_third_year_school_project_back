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
exports.ThemeEntity = void 0;
const typeorm_1 = require("typeorm");
const encadrement_entity_1 = require("./encadrement.entity");
const entreprise_entity_1 = require("./entreprise.entity");
const promotion_entity_1 = require("./promotion.entity");
const responsible_entity_1 = require("./responsible.entity");
const teacher_entity_1 = require("./teacher.entity");
const team_entity_1 = require("./team.entity");
const theme_document_entity_1 = require("./theme.document.entity");
const wish_entity_1 = require("./wish.entity");
let ThemeEntity = class ThemeEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ThemeEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ThemeEntity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ThemeEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: false,
    }),
    __metadata("design:type", Boolean)
], ThemeEntity.prototype, "validated", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => theme_document_entity_1.ThemeDocumentEntity, themeDocument => themeDocument.theme),
    __metadata("design:type", Array)
], ThemeEntity.prototype, "documents", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => team_entity_1.TeamEntity, team => team.givenTheme),
    __metadata("design:type", Array)
], ThemeEntity.prototype, "teams", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => encadrement_entity_1.EncadrementEntity, encadrement => encadrement.theme),
    __metadata("design:type", Array)
], ThemeEntity.prototype, "encadrement", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => teacher_entity_1.TeacherEntity, teacher => teacher.suggestedThemes),
    __metadata("design:type", teacher_entity_1.TeacherEntity)
], ThemeEntity.prototype, "suggestedByTeacher", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => entreprise_entity_1.EntrepriseEntity, entreprise => entreprise.suggestedThemes),
    __metadata("design:type", entreprise_entity_1.EntrepriseEntity)
], ThemeEntity.prototype, "suggestedByEntreprise", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => promotion_entity_1.PromotionEntity, promotion => promotion.themes),
    __metadata("design:type", promotion_entity_1.PromotionEntity)
], ThemeEntity.prototype, "promotion", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => wish_entity_1.WishEntity, wish => wish.theme),
    __metadata("design:type", Array)
], ThemeEntity.prototype, "wishes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => responsible_entity_1.ResponsibleEntity, res => res.theme),
    __metadata("design:type", Array)
], ThemeEntity.prototype, "resbonsibilities", void 0);
ThemeEntity = __decorate([
    (0, typeorm_1.Entity)('theme')
], ThemeEntity);
exports.ThemeEntity = ThemeEntity;
//# sourceMappingURL=theme.entity.js.map