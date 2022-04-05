import { jwtPayload } from "./jwtPayload.type";

export type jwtPayloadWithRefrechToken = jwtPayload & {refrechToken:string}