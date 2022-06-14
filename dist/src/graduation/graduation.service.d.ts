import { SoutenanceDto } from "src/core/dtos/user.dto";
import { SoutenanceEntity } from "src/core/entities/soutenance.entity";
export declare class GraduationService {
    createSoutenance(userId: string, data: SoutenanceDto): Promise<string>;
    getSoutenance(soutenanceId: string): Promise<SoutenanceEntity>;
    getSoutenances(promotionId: string): Promise<SoutenanceEntity[]>;
}
