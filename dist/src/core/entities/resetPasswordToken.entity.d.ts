import { UserEntity } from "./user.entity";
export declare class RestPasswordTokenEntity {
    id: string;
    token: string;
    createdAt: Date;
    expiresIn: number;
    user: UserEntity;
}
