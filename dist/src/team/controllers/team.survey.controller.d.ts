import { TeamSurveyService } from "../services/team.survey.service";
export declare class TeamSurveyController {
    private readonly teamSurveyService;
    constructor(teamSurveyService: TeamSurveyService);
    getSurveys(userId: string): Promise<import("../../core/entities/survey.entity").SurveyEntity[]>;
    getSurvey(userId: string, surveyId: string): Promise<{
        id: string;
        title: string;
        description: string;
        createdAt: Date;
        period: number;
        close: boolean;
        team: import("../../core/entities/team.entity").TeamEntity;
        options: import("../../core/entities/survey.option.entity").SurveyOptionEntity[];
        participants: import("../../core/entities/survey.participant.entity").SurveyParticipantEntity[];
    }>;
    submitSurveyAnswer(userId: string, surveyId: string, optionId: string, argument: string): Promise<"survey answered succesfully" | "answer updated succesfully">;
    getSurveyParticipantsArguments(userId: string, surveyId: string, optionId: string): Promise<import("../../core/entities/survey.participant.entity").SurveyParticipantEntity[]>;
}
