import { SoutenanceDto } from "src/core/dtos/user.dto";
import { GraduationService } from "./graduation.service";
export declare class GraduationController {
    private readonly graduationService;
    constructor(graduationService: GraduationService);
    createSoutenance(userId: string, data: SoutenanceDto): Promise<string>;
    getSoutenances(userId: string, promotionId: string): Promise<import("../core/entities/soutenance.entity").SoutenanceEntity[]>;
    getSoutenance(userId: string, soutenanceId: string): Promise<import("../core/entities/soutenance.entity").SoutenanceEntity>;
}
