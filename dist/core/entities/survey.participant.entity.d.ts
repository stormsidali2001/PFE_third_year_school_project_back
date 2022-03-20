import { StudentEntity } from "./student.entity";
import { SurveyEntity } from "./survey.entity";
export declare class SurveyParticipantEntity {
    id: string;
    student: StudentEntity;
    survey: SurveyEntity;
}
