"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const session = require("express-session");
const passport = require("passport");
async function bootstrap() {
    const port = process.env.PORT || 8080;
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        credentials: true,
        origin: ['http://localhost:3000'],
        methods: ['POST', 'GET']
    });
    const sessionMid = session({
        name: 'NESTJS_SESSION_ID',
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 6 * 60 * 60 * 1000,
            secure: false,
            httpOnly: true,
        }
    });
    app.use(sessionMid);
    app.use(passport.initialize());
    app.use(passport.session());
    app.useGlobalPipes(new common_1.ValidationPipe({ transform: true }));
    await app.listen(port);
    common_1.Logger.log(`the server is running on http://localhost:${port}`, 'Bootstrap');
}
bootstrap();
//# sourceMappingURL=main.js.map