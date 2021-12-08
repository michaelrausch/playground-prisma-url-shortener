"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLinkGeneratorRoutes = void 0;
const express_1 = __importDefault(require("express"));
const { PrismaClient, Prisma } = require("@prisma/client");
const { body, validationResult } = require('express-validator');
const prisma = new PrismaClient();
function getLinkGeneratorRoutes() {
    const router = express_1.default.Router();
    router.post('/create', body('url').exists(), body('slug').isLength({ min: 5 }), createShortLink);
    router.get('/:slug', redirectToShortLink);
    return router;
}
exports.getLinkGeneratorRoutes = getLinkGeneratorRoutes;
function createShortLink(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 400, "E0003", "Validation Failed");
        }
        try {
            yield prisma.link.create({
                data: {
                    shortLink: body.slug,
                    url: body.url
                }
            });
        }
        catch (error) {
            // Unique constraint failed, see prisma.io/docs/reference/api-reference/error-reference
            // @ts-ignore
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                return errorResponse(res, 400, "E0001", "URL slug already exists");
            }
            else {
                return errorResponse(res, 500, "E0002", "Unknown error");
            }
        }
        return createdResponse(res, body.slug);
    });
}
function redirectToShortLink(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const slug = req.params.slug;
        const result = yield prisma.link.findUnique({
            where: {
                shortLink: slug
            }
        });
        if (result == null) {
            return res.status(404).send("");
        }
        res.redirect(result.url);
    });
}
function errorResponse(res, responsecode, errorCode, message) {
    return res.status(responsecode).json({
        success: false,
        error: {
            code: errorCode,
            message: message
        }
    });
}
function createdResponse(res, slug) {
    return res.status(200).json({
        success: true,
        error: {
            code: "",
            message: ""
        },
        result: {
            url: "https://localhost:8080/api/" + slug
        }
    });
}
