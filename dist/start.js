"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = void 0;
const express_1 = __importDefault(require("express"));
const loglevel_1 = __importDefault(require("loglevel"));
require("express-async-errors");
const routes_1 = require("./routes");
function startServer(port = process.env.SERVER_PORT) {
    loglevel_1.default.log("H");
    const app = (0, express_1.default)();
    app.use('/', (0, routes_1.getRoutes)());
    app.listen(port);
}
exports.startServer = startServer;
//# sourceMappingURL=start.js.map