import { EncadrementEntity } from "./encadrement.entity";
import { TeamEntity } from "./team.entity";
import { ThemeDocumentEntity } from "./theme.document.entity";
export declare class ThemeEntity {
    id: string;
    title: string;
    descriptioN: string;
    documents: ThemeDocumentEntity[];
    teams: TeamEntity[];
    encadrement: EncadrementEntity[];
}
