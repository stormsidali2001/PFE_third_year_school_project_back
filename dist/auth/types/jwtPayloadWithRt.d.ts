import { jwtPayload } from "./jwtPayload.type";
export declare type jwtWithRefrechToken = jwtPayload & {
    refrechToken: string;
};
