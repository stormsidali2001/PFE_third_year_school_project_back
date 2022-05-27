import { Entity, JoinColumn, ManyToOne, OneToOne} from 'typeorm';
import { DoucmentData } from '../abstracts/document.data';
import { CommitEntity } from './commit.entity';
import { DocumentTypeEntity } from './document-types.entity';
import { ThemeEntity } from './theme.entity';
@Entity('commit_document')
export class CommitDocumentEntity extends DoucmentData{
    
    //ralations
    @ManyToOne(type=>CommitEntity,commit=>commit.documents)
    commit:ThemeEntity;

    
    @OneToOne(type=>DocumentTypeEntity) @JoinColumn()
    type:DocumentTypeEntity;


}