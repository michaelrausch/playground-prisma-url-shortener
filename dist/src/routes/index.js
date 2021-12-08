"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoutes = void 0;
const express_1 = __importDefault(require("express"));
const link_1 = require("./link");
function getRoutes() {
    const router = express_1.default.Router();
    // Set up routes here router.use('/', getHelloRoutes())
    router.use('/api', (0, link_1.getLinkGeneratorRoutes)());
    return router;
}
exports.getRoutes = getRoutes;
