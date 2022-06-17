import { ThemeDocDto } from "src/core/dtos/user.dto";
import { ThemeEntity } from "src/core/entities/theme.entity";
import { UserService } from "src/user/user.service";
export declare class ThemeService {
    private readonly userService;
    constructor(userService: UserService);
    createThemeSuggestion(userId: string, title: string, description: string, documents: ThemeDocDto[], promotionId: string): Promise<void>;
    getThemeSuggestions(promotionId: string): Promise<ThemeEntity[]>;
    getAllThemeSuggestions(): Promise<ThemeEntity[]>;
    getThemeSuggestion(themeId: string): Promise<ThemeEntity>;
    validateThemeSuggestion(userId: string, themeId: string): Promise<void>;
    getAllThemes(): Promise<ThemeEntity[]>;
    getThemes(promotionId: string): Promise<ThemeEntity[]>;
    getTheme(themeId: string): Promise<ThemeEntity>;
}
