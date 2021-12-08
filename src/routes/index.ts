import express from 'express'
import { getLinkGeneratorRoutes } from './link';

function getRoutes() {
    const router = express.Router();

    // Set up routes here router.use('/', getHelloRoutes())
    router.use('/api', getLinkGeneratorRoutes())

    return router
}

export { getRoutes }