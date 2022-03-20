import { DoucmentData } from "../abstracts/document.data";
import { EvaluationEntity } from "./evaluation.entity";
import { ModificationActionEntity } from "./modification.action.entity";
import { StudentEntity } from "./student.entity";
import { TeamDocumentCommit } from "./team.document.commit.entity";
import { TeamEntity } from "./team.entity";
export declare class TeamDocumentEntity extends DoucmentData {
    deleted: boolean;
    team: TeamEntity;
    owner: StudentEntity;
    evaluation: EvaluationEntity;
    modificationActions: ModificationActionEntity[];
    teamDocumentCommit: TeamDocumentCommit;
}
