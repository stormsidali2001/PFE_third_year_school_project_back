import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import { DoucmentData } from '../abstracts/document.data';
import { ThemeEntity } from './theme.entity';
@Entity('theme_document')
export class ThemeDocumentEntity extends DoucmentData{
    //ralations
    @ManyToOne(type=>ThemeEntity,theme=>theme.documents)
    theme:ThemeEntity;


}