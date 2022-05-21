"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionAdapter = void 0;
const passport = require("passport");
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
class SessionAdapter extends platform_socket_io_1.IoAdapter {
    constructor(session, app) {
        super(app);
        this.session = session;
    }
    createIOServer(port, options) {
        const server = super.createIOServer(port, options);
        const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);
        server.use((socket, next) => {
            socket.data.username = 'houda rahi hna ';
            next();
        });
        server.use(wrap(this.session));
        server.use(wrap(passport.initialize()));
        server.use(wrap(passport.session()));
        console.log("hhhhhhhhhhhh");
        return server;
    }
}
exports.SessionAdapter = SessionAdapter;
//# sourceMappingURL=SessionAdapter.js.map