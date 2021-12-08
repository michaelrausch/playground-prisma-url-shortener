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
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const uuid_1 = require("uuid");
const supertest = require('supertest');
const requestWithSupertest = supertest(server_1.server);
describe('Endpoints', () => {
    it('POST /api/create should return error if url isnt provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield requestWithSupertest.post('/api/create')
            .send({ "slug": (0, uuid_1.v4)().toString() });
        expect(res.status).toEqual(400);
        expect(res.body).toHaveProperty('success');
    }));
    it('POST /api/create should create a shortlink', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield requestWithSupertest.post('/api/create')
            .send({ "slug": "validslug", "url": "https://google.com" });
        expect(res.status).toEqual(200);
        expect(res.body.success).toBe(true);
    }));
    it('POST /api/create should fail when creating a shortlink that already exists', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield requestWithSupertest.post('/api/create')
            .send({ "slug": "validslug", "url": "https://google.com" });
        expect(res.status).toEqual(400);
        expect(res.body.success).toBe(false);
    }));
    it('POST /api/:slug should redirect with a valid slug', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield requestWithSupertest.get('/api/' + 'validslug');
        expect(res.status).toEqual(302);
    }));
    it('POST /api/:slug should 404 with an invalid slug', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield requestWithSupertest.get('/api/' + 'invalidslug');
        expect(res.status).toEqual(404);
    }));
});
