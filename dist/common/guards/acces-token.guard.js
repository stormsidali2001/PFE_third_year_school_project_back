"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessTokenGuard = void 0;
const passport_1 = require("@nestjs/passport");
class AccessTokenGuard extends (0, passport_1.AuthGuard)('jwt') {
    constructor(reflector) {
        super();
        this.reflector = reflector;
    }
    canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride('isPublic', [
            context.getHandler(),
            context.getClass()
        ]);
        if (isPublic)
            return true;
        return super.canActivate(context);
    }
}
exports.AccessTokenGuard = AccessTokenGuard;
//# sourceMappingURL=acces-token.guard.js.map