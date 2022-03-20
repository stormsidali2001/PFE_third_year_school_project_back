import { EntityRepository, Repository } from "typeorm";
import { RestPasswordTokenEntity } from "../entities/resetPasswordToken.entity";

@EntityRepository(RestPasswordTokenEntity)
export class RestPasswordTokenRepository extends Repository<RestPasswordTokenEntity>{
    
}