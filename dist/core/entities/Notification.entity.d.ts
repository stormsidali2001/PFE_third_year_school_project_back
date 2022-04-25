import { UserEntity } from "./user.entity";
export declare class NotificationEntity {
    id: string;
    description: string;
    seen: boolean;
    createdAt: Date;
    user: UserEntity;
}
