import { ThemeEntity } from "./theme.entity";
import { UserEntity } from "./user.entity";
export declare class EntrepriseEntity {
    id: string;
    code: string;
    name: string;
    user: UserEntity;
    suggestedThemes: ThemeEntity[];
}
