"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const theme_assignement_controller_1 = require("./controllers/theme.assignement.controller");
const theme_commits_controller_1 = require("./controllers/theme.commits.controller");
const theme_controller_1 = require("./controllers/theme.controller");
const theme_supervision_controller_1 = require("./controllers/theme.supervision.controller");
const theme_assignement_service_1 = require("./services/theme.assignement.service");
const theme_commits_service_1 = require("./services/theme.commits.service");
const theme_service_1 = require("./services/theme.service");
const theme_supervision_service_1 = require("./services/theme.supervision.service");
let ThemeModule = class ThemeModule {
};
ThemeModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([])],
        providers: [theme_service_1.ThemeService, theme_supervision_service_1.ThemeSupervisionService, theme_assignement_service_1.ThemeAssignementService, theme_commits_service_1.ThemeCommitsService],
        controllers: [theme_controller_1.ThemeController, theme_supervision_controller_1.ThemeSupervisionController, theme_assignement_controller_1.ThemeAssignementController, theme_commits_controller_1.ThemeCommitsController]
    })
], ThemeModule);
exports.ThemeModule = ThemeModule;
//# sourceMappingURL=theme.module.js.map