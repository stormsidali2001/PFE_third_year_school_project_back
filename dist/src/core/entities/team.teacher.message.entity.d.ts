import { StudentEntity } from "./student.entity";
import { TeacherEntity } from "./teacher.entity";
import { TeamEntity } from "./team.entity";
export declare class TeamTeacherChatMessage {
    id: string;
    message: string;
    createdAt: Date;
    team: TeamEntity;
    ownerS: StudentEntity;
    ownerT: TeacherEntity;
}
