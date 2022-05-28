import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne} from 'typeorm';
import { DoucmentData } from '../abstracts/document.data';
import { CommitEntity } from './commit.entity';
import { DocumentTypeEntity } from './document-types.entity';
import { ThemeEntity } from './theme.entity';
@Entity('commit_document')
export class CommitDocumentEntity extends DoucmentData{
    
    @Column({
        default:false
    })
    validated:boolean;
    //ralations
    @ManyToOne(type=>CommitEntity,commit=>commit.documents)
    commit:ThemeEntity;


    
    @ManyToOne(type=>DocumentTypeEntity,dt=>dt.commitsDocs) 
    type:DocumentTypeEntity;

  


}