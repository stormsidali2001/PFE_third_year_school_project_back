import {Entity,PrimaryGeneratedColumn,ManyToOne} from 'typeorm';
import {TeacherEntity} from './teacher.entity'
import { ThemeEntity } from './theme.entity';
@Entity('encadrement')
export class EncadrementEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    //relations
    
    //to teacher
    @ManyToOne(type=>TeacherEntity,teacher=>teacher.encadrements)
    teacher:TeacherEntity;
    //to theme
    @ManyToOne(type=>ThemeEntity,theme=>theme.encadrement)
    theme:ThemeEntity;
}