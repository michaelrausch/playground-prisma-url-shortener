import { server } from './server'
import { v4 as uuidv4 } from 'uuid';

const supertest = require('supertest');
const requestWithSupertest = supertest(server);

describe('Endpoints', () => {
    it('POST /api/create should return error if url isnt provided', async () => {
        const res = await requestWithSupertest.post('/api/create')
            .send({"slug": uuidv4().toString()});

        expect(res.status).toEqual(400);
        expect(res.body).toHaveProperty('success')
    })

    it('POST /api/create should create a shortlink', async () => {
        const res = await requestWithSupertest.post('/api/create')
            .send({"slug": "validslug", "url": "https://google.com"})

        expect(res.status).toEqual(200);
        expect(res.body.success).toBe(true);
    })

    it('POST /api/create should fail when creating a shortlink that already exists', async () => {
        const res = await requestWithSupertest.post('/api/create')
            .send({"slug": "validslug", "url": "https://google.com"})

        expect(res.status).toEqual(400);
        expect(res.body.success).toBe(false);
    })

    it('POST /api/:slug should redirect with a valid slug', async () => {
        const res = await requestWithSupertest.get('/api/' + 'validslug')

        expect(res.status).toEqual(302);
    })

    it('POST /api/:slug should 404 with an invalid slug', async () => {
        const res = await requestWithSupertest.get('/api/' + 'invalidslug')

        expect(res.status).toEqual(404);
    })
})