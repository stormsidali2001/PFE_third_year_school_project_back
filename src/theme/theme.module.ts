import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ThemeAssignementController } from "./controllers/theme.assignement.controller";
import { ThemeCommitsController } from "./controllers/theme.commits.controller";
import { ThemeController } from "./controllers/theme.controller";
import { ThemeSupervisionController } from "./controllers/theme.supervision.controller";
import { ThemeAssignementService } from "./services/theme.assignement.service";
import { ThemeCommitsService } from "./services/theme.commits.service";
import { ThemeService } from "./services/theme.service";
import { ThemeSupervisionService } from "./services/theme.supervision.service";



@Module({
    imports:[TypeOrmModule.forFeature([])],
    providers:[ThemeService,ThemeSupervisionService,ThemeAssignementService,ThemeCommitsService],
    controllers:[ThemeController,ThemeSupervisionController,ThemeAssignementController,ThemeCommitsController]

})
export class ThemeModule{}
