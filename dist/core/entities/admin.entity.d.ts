import { NotificationEntity } from "./Notification.entity";
import { UserEntity } from "./user.entity";
export declare class AdminEntity {
    id: String;
    code: string;
    name: String;
    user: UserEntity;
    notifications: NotificationEntity[];
}
