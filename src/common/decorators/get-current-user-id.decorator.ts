import { createParamDecorator , ExecutionContext} from "@nestjs/common";
import { jwtPayload } from "src/auth/types/jwtPayload.type";

export const GetCurrentUserId = createParamDecorator((_:undefined,context:ExecutionContext):string=>{
    const request = context.switchToHttp().getRequest();
    const user = request.user as jwtPayload;
    return user.uuid;
})