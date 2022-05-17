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
exports.ThemeSuggestionEntity = void 0;
const typeorm_1 = require("typeorm");
const teacher_entity_1 = require("./teacher.entity");
const theme_suggestion_document_entity_1 = require("./theme.suggestion.document.entity");
let ThemeSuggestionEntity = class ThemeSuggestionEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ThemeSuggestionEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ThemeSuggestionEntity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ThemeSuggestionEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => theme_suggestion_document_entity_1.ThemeSuggestionDocumentEntity, themeSuggestionDocument => themeSuggestionDocument.themeSuggestion),
    __metadata("design:type", Array)
], ThemeSuggestionEntity.prototype, "documents", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => teacher_entity_1.TeacherEntity, teacher => teacher.themeSuggestions),
    __metadata("design:type", teacher_entity_1.TeacherEntity)
], ThemeSuggestionEntity.prototype, "teacher", void 0);
ThemeSuggestionEntity = __decorate([
    (0, typeorm_1.Entity)('theme_suggestion')
], ThemeSuggestionEntity);
exports.ThemeSuggestionEntity = ThemeSuggestionEntity;
//# sourceMappingURL=theme.suggestion.js.map