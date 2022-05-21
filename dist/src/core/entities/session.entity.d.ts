import { ISession } from "connect-typeorm";
export declare class SessionEntity implements ISession {
    expiredAt: number;
    id: string;
    json: string;
}
