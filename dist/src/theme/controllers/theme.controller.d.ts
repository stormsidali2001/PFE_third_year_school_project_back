import { ThemeDocDto } from "src/core/dtos/user.dto";
import { ThemeService } from "../services/theme.service";
export declare class ThemeController {
    private readonly themeService;
    constructor(themeService: ThemeService);
    createThemeSuggestion(userId: string, title: string, description: string, documents: ThemeDocDto[], promotionId: string): Promise<void>;
    getWishLists(promotionId: string): Promise<import("../../core/entities/team.entity").TeamEntity[]>;
    getThemeSuggestions(promotionId: string): Promise<import("../../core/entities/theme.entity").ThemeEntity[]>;
    getAllThemeSuggestions(): Promise<import("../../core/entities/theme.entity").ThemeEntity[]>;
    getThemeSuggestion(themeId: string): Promise<import("../../core/entities/theme.entity").ThemeEntity>;
    validateThemeSuggestion(userId: string, themeId: string): Promise<void>;
    getAllThemes(): Promise<import("../../core/entities/theme.entity").ThemeEntity[]>;
    getThemes(promotionId: string): Promise<import("../../core/entities/theme.entity").ThemeEntity[]>;
    getTheme(themeId: string): Promise<import("../../core/entities/theme.entity").ThemeEntity>;
}
