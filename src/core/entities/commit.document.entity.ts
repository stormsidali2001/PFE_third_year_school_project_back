import { Entity, ManyToOne} from 'typeorm';
import { DoucmentData } from '../abstracts/document.data';
import { CommitEntity } from './commit.entity';
import { ThemeEntity } from './theme.entity';
@Entity('commit_document')
export class CommitDocumentEntity extends DoucmentData{
    //ralations
    @ManyToOne(type=>CommitEntity,commit=>commit.documents)
    commit:ThemeEntity;


}