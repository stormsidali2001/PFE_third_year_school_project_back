"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketSessionAdapter = void 0;
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
const sharedsession = require("express-socket.io-session");
const session = require("express-session");
class SocketSessionAdapter extends platform_socket_io_1.IoAdapter {
    constructor(app) {
        super(app);
        this.app = app;
    }
    createIOServer(port, options) {
        const server = super.createIOServer(port, options);
        let sessionMd = session({
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
        this.app.use(sessionMd);
        server.use(sharedsession(sessionMd, {
            autoSave: true
        }));
        return server;
    }
}
exports.SocketSessionAdapter = SocketSessionAdapter;
//# sourceMappingURL=socket-session.adapter.js.map