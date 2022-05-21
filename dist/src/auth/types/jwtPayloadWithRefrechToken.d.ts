import { jwtPayload } from "./jwtPayload.type";
export declare type jwtPayloadWithRefrechToken = jwtPayload & {
    refrechToken: string;
};
