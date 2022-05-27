import { DoucmentData } from "../abstracts/document.data";
import { EvaluationEntity } from "./evaluation.entity";
import { ModificationActionEntity } from "./modification.action.entity";
import { StudentEntity } from "./student.entity";
import { TeamDocumentCommit } from "./team.document.commit.entity";
import { TeamEntity } from "./team.entity";
export declare enum DocumentType {
    CAHIER_CHARGE = "cahier_charge",
    CAHIER_ANALYSE = "cahier_analyse",
    CAHIER_CONCEPTION = "cahier_conception",
    CAHIER_ARCHITECTURE = "cahier_architecture",
    CHARTE_NOMAGE_DOCUMENT = "charte_nomage_document",
    CHARTE_NOMAGE_CODE = "charte_nomage_code",
    PROFIL_MEMBRE = "profil_membre",
    OTHERS = "others"
}
export declare class TeamDocumentEntity extends DoucmentData {
    description: string;
    type: DocumentType;
    team: TeamEntity;
    owner: StudentEntity;
    evaluation: EvaluationEntity;
    modificationActions: ModificationActionEntity[];
    teamDocumentCommit: TeamDocumentCommit;
}
