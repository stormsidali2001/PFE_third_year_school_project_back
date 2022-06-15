import { SoutenanceDto } from "src/core/dtos/user.dto";
import { SoutenanceEntity } from "src/core/entities/soutenance.entity";
import { UserService } from "src/user/user.service";
export declare class GraduationService {
    private readonly userService;
    constructor(userService: UserService);
    createSoutenance(userId: string, data: SoutenanceDto): Promise<string>;
    getSoutenance(soutenanceId: string): Promise<SoutenanceEntity>;
    getSoutenances(promotionId: string): Promise<SoutenanceEntity[]>;
}
