import { TeamEntity } from './team.entity';
import { ThemeEntity } from './theme.entity';
export declare class WishEntity {
    id: string;
    createdAt: Date;
    order: number;
    team: TeamEntity;
    theme: ThemeEntity;
}
