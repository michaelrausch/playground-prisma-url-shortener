import logger from 'loglevel'
import { server } from './server'

require('dotenv').config()

server.listen(process.env.SERVER_PORT)