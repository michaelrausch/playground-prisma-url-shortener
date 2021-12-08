import express from "express"
import logger from 'loglevel'
import bodyParser from "body-parser"

import { getRoutes } from "./routes"

const app = express()
app.use(bodyParser.json())
app.use('/', getRoutes());

export const server = app;