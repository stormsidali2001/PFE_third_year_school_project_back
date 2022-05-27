import { CommitDocumentEntity } from "./commit.document.entity";
import { PromotionEntity } from "./promotion.entity";
import { TeamDocumentEntity } from "./team.document.entity";
export declare class DocumentTypeEntity {
    id: string;
    name: string;
    promotion: PromotionEntity;
    commitsDocs: CommitDocumentEntity[];
    teamDocs: TeamDocumentEntity[];
}
