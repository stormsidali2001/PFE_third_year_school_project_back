import { DoucmentData } from '../abstracts/document.data';
import { DocumentTypeEntity } from './document-types.entity';
import { ThemeEntity } from './theme.entity';
export declare class CommitDocumentEntity extends DoucmentData {
    commit: ThemeEntity;
    type: DocumentTypeEntity;
}
