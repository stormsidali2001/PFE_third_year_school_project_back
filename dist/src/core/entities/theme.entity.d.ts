import { EncadrementEntity } from "./encadrement.entity";
import { EntrepriseEntity } from "./entreprise.entity";
import { PromotionEntity } from "./promotion.entity";
import { ResponsibleEntity } from "./responsible.entity";
import { TeacherEntity } from "./teacher.entity";
import { TeamEntity } from "./team.entity";
import { ThemeDocumentEntity } from "./theme.document.entity";
import { WishEntity } from "./wish.entity";
export declare class ThemeEntity {
    id: string;
    title: string;
    description: string;
    validated: boolean;
    documents: ThemeDocumentEntity[];
    teams: TeamEntity[];
    encadrement: EncadrementEntity[];
    suggestedByTeacher: TeacherEntity;
    suggestedByEntreprise: EntrepriseEntity;
    promotion: PromotionEntity;
    wishes: WishEntity[];
    resbonsibilities: ResponsibleEntity[];
}
