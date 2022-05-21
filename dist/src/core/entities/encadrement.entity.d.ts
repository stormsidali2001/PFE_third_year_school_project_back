import { TeacherEntity } from './teacher.entity';
import { ThemeEntity } from './theme.entity';
export declare class EncadrementEntity {
    id: string;
    teacher: TeacherEntity;
    theme: ThemeEntity;
}
