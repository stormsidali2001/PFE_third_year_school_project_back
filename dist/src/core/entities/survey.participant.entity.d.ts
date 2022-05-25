import { StudentEntity } from "./student.entity";
import { SurveyEntity } from "./survey.entity";
import { SurveyOptionEntity } from "./survey.option.entity";
export declare class SurveyParticipantEntity {
    id: string;
    argument: string;
    student: StudentEntity;
    survey: SurveyEntity;
    answer: SurveyOptionEntity;
}
