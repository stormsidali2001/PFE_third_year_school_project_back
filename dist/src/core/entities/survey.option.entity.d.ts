import { SurveyEntity } from "./survey.entity";
import { SurveyParticipantEntity } from "./survey.participant.entity";
export declare class SurveyOptionEntity {
    id: string;
    description: string;
    survey: SurveyEntity;
    participations: SurveyParticipantEntity[];
}
