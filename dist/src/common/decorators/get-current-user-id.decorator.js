"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCurrentUserId = void 0;
const common_1 = require("@nestjs/common");
exports.GetCurrentUserId = (0, common_1.createParamDecorator)((_, context) => {
    const request = context.switchToHttp().getRequest();
    const user = request.session.passport.user;
    const userId = user.id;
    common_1.Logger.error(JSON.stringify(user), "decorator");
    return userId;
});
//# sourceMappingURL=get-current-user-id.decorator.js.map