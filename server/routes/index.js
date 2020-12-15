import express from 'express'
import { MONGO_DB_COLLECTION } from '../db/consts'
import { getRandomAcronyms } from '../db/providers/acronyms'
import { validateInteger, validatePresentParams, verifyPresentParams } from '../providers/requestHandlers'
const router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Invert-API' })
})

/* GET random acronym */
router.get('/random/:count', function (req, res, next) {
  verifyPresentParams(['count'], {...req.params})
    .then(() => {
      validatePresentParams(
        req.params,
        {
          count: validateInteger          
        }
      )
        .then(() => {
          getRandomAcronyms(req.mongo, MONGO_DB_COLLECTION, parseInt(req.params.count))
            .then(succ => req.handleSuccess(succ, res))
            .catch(error => next(error))
        })
        .catch(error => next(error))
    })
    .catch(error => next(error))
})

export default router
