import { DoucmentData } from "../abstracts/document.data";
import { DocumentTypeEntity } from "./document-types.entity";
import { EvaluationEntity } from "./evaluation.entity";
import { ModificationActionEntity } from "./modification.action.entity";
import { StudentEntity } from "./student.entity";
import { TeamEntity } from "./team.entity";
export declare class TeamDocumentEntity extends DoucmentData {
    description: string;
    team: TeamEntity;
    owner: StudentEntity;
    evaluation: EvaluationEntity;
    modificationActions: ModificationActionEntity[];
    type: DocumentTypeEntity;
}
