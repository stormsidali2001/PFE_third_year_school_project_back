import { Repository } from "typeorm";
import { TeamEntity } from "../entities/team.entity";
export declare class TeamRepository extends Repository<TeamEntity> {
    getTeamsList(): Promise<TeamEntity[]>;
}
