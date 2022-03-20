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
const team_entity_1 = require("./team.entity");
const theme_document_entity_1 = require("./theme.document.entity");
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
], ThemeEntity.prototype, "descriptioN", void 0);
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
ThemeEntity = __decorate([
    (0, typeorm_1.Entity)('theme')
], ThemeEntity);
exports.ThemeEntity = ThemeEntity;
//# sourceMappingURL=theme.entity.js.map