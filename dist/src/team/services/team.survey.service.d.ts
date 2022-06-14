import { SchedulerRegistry } from "@nestjs/schedule";
import { SurveyDto } from "src/core/dtos/user.dto";
import { SurveyEntity } from "src/core/entities/survey.entity";
import { SurveyOptionEntity } from "src/core/entities/survey.option.entity";
import { SurveyParticipantEntity } from "src/core/entities/survey.participant.entity";
import { UserService } from "src/user/user.service";
export declare class TeamSurveyService {
    private readonly userService;
    private schedulerRegistry;
    constructor(userService: UserService, schedulerRegistry: SchedulerRegistry);
    createSurvey(userId: string, survey: SurveyDto): Promise<string>;
    getSurveys(userId: string): Promise<SurveyEntity[]>;
    getSurvey(userId: string, surveyId: string): Promise<{
        id: string;
        title: string;
        description: string;
        createdAt: Date;
        period: number;
        close: boolean;
        team: import("../../core/entities/team.entity").TeamEntity;
        options: SurveyOptionEntity[];
        participants: SurveyParticipantEntity[];
    }>;
    submitSurveyAnswer(userId: string, surveyId: string, optionId: string, argument: string): Promise<"survey answered succesfully" | "answer updated succesfully">;
    getSurveyParticipantsArguments(userId: string, surveyId: string, optionId: string): Promise<SurveyParticipantEntity[]>;
}
