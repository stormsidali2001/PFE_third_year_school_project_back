import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { jwtPayloadWithRefrechToken } from "src/auth/types/jwtPayloadWithRefrechToken";

export const GetCurrentUser = createParamDecorator((data:keyof jwtPayloadWithRefrechToken|undefined,context:ExecutionContext)=>{
    const request = context.switchToHttp().getRequest();
    if(!data) return request.user
   return request.user[data];
})