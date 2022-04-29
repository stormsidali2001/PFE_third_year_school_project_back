import { createParamDecorator , ExecutionContext, Logger} from "@nestjs/common";

export const GetCurrentUserId = createParamDecorator((_:undefined,context:ExecutionContext):string=>{
    const request = context.switchToHttp().getRequest();
    const user = request.session.passport.user;
    const userId = user.id
    Logger.error(JSON.stringify(user),"decorator")
    return userId;
})