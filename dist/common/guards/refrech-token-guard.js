"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefrechTokenGuard = void 0;
const passport_1 = require("@nestjs/passport");
class RefrechTokenGuard extends (0, passport_1.AuthGuard)('jwt-refrech') {
    constructor() {
        super();
    }
}
exports.RefrechTokenGuard = RefrechTokenGuard;
//# sourceMappingURL=refrech-token-guard.js.map