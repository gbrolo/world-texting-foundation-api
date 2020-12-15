import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'

import indexRouter from './routes/index'
import acronymRouter from './routes/acronym'

import client from './db/client'
import { openConnection } from './db/mongoHandler'
import { createTextIndex } from './db/indexes'

const appInit = new Promise((resolve, reject) => [
  openConnection(client)
    .then(db => {
      createTextIndex(db, 'acronyms', ['acronym', 'definition'])      

      const app = express()

      app.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, POST, DELETE, PUT')
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type')
        next()
      })

      app.use(logger('dev'))
      app.use(express.json())
      app.use(express.urlencoded({ extended: false }))
      app.use(cookieParser())
      app.use(express.static(path.join(__dirname, '../public')))
      app.use('/', indexRouter)
      app.use('/acronym', acronymRouter)

      resolve(app)
    })
    .catch(error => reject(error))
])

export default appInit
