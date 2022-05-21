import { SurveyOptionEntity } from "./survey.option.entity";
import { SurveyParticipantEntity } from "./survey.participant.entity";
import { TeamEntity } from "./team.entity";
export declare class SurveyEntity {
    id: string;
    title: string;
    description: string;
    createdAt: Date;
    period: number;
    close: boolean;
    team: TeamEntity;
    options: SurveyOptionEntity[];
    participants: SurveyParticipantEntity[];
}
