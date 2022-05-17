"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const session = require("express-session");
const passport = require("passport");
const connect_typeorm_1 = require("connect-typeorm");
const typeorm_1 = require("typeorm");
const session_entity_1 = require("./core/entities/session.entity");
const SessionAdapter_1 = require("./adapters/SessionAdapter");
async function bootstrap() {
    const port = process.env.PORT || 8080;
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        credentials: true,
        origin: ['http://localhost:3000'],
        methods: ['POST', 'GET']
    });
    const sessionRepository = (0, typeorm_1.getManager)().getRepository(session_entity_1.SessionEntity);
    const store = new connect_typeorm_1.TypeormStore({
        ttl: 86400
    }).connect(sessionRepository);
    const sessionMid = session({
        name: 'NESTJS_SESSION_ID',
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,
        store,
        cookie: {
            maxAge: 6 * 60 * 60 * 1000,
            secure: false,
            httpOnly: true,
        }
    });
    app.use(sessionMid);
    app.use(passport.initialize());
    app.use(passport.session());
    app.useWebSocketAdapter(new SessionAdapter_1.SessionAdapter(sessionMid, app));
    app.useGlobalPipes(new common_1.ValidationPipe({ transform: true }));
    await app.listen(port);
    common_1.Logger.log(`the server is running on http://localhost:${port}`, 'Bootstrap');
}
bootstrap();
//# sourceMappingURL=main.js.map