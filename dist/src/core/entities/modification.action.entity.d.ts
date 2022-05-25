import { TeamDocumentEntity } from './team.document.entity';
import { TeamEntity } from './team.entity';
export declare enum ModificationType {
    INSERTION = "insertion",
    DELETION = "deletion",
    UPDATE = "update"
}
export declare class ModificationActionEntity {
    id: string;
    type: ModificationType;
    createdAt: Date;
    teamDocument: TeamDocumentEntity;
    team: TeamEntity;
}
