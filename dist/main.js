"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const port = process.env.PORT || 8080;
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { cors: false });
    await app.listen(port);
    common_1.Logger.log(`the server is running on http://localhost:${port}`, 'Bootstrap');
}
bootstrap();
//# sourceMappingURL=main.js.map