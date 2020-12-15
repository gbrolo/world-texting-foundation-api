import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import winston from 'winston'

import indexRouter from './routes/index'
import acronymRouter from './routes/acronym'

import client from './db/client'
import { openConnection } from './db/mongoHandler'
import { createTextIndex } from './db/indexes'
import { MONGO_DB_COLLECTION } from './db/consts'
import { handleError } from './handlers/error'
import { handleSuccess } from './handlers/success'

const appInit = new Promise((resolve, reject) => [
  openConnection(client)
    .then(db => {
      createTextIndex(db, MONGO_DB_COLLECTION, ['acronym', 'definition'])      

      const app = express()

      app.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, POST, DELETE, PUT')
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type')
        next()
      })

      const errorLogger = new winston.createLogger({
        level: 'error',
        format: winston.format.json(),
        exitOnError: false,
        transports: [
          new winston.transports.File({ filename: './errors.log' })
        ]
      })

      app.use(function (req, res, next) {
        req.mongo = db
        req.errorLogger = errorLogger
        req.handleSuccess = handleSuccess
        next()
      })

      app.use(logger('dev'))
      app.use(express.json())
      app.use(express.urlencoded({ extended: false }))
      app.use(cookieParser())
      app.use(express.static(path.join(__dirname, '../public')))
      app.use('/', indexRouter)
      app.use('/acronym', acronymRouter)

      app.use(function (err, req, res, next) {
        handleError(err, req, res)
      })

      resolve(app)
    })
    .catch(error => reject(error))
])

export default appInit
