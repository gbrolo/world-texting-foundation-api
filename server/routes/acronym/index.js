import express from 'express'
import { error } from 'winston'
import { MONGO_DB_COLLECTION } from '../../db/consts'
import { insertBaseAcronyms } from '../../db/insertions'
import { addAcronym, deleteAcronym, getAcronym, getAcronyms, updateAcronym } from '../../db/providers/acronyms'
import { getAuthenticationToken, verifyPresentParams } from '../../providers/requestHandlers'
const router = express.Router()

/* GET acronyms list */
router.get('/', function (req, res, next) {
  const query = Object.keys(req.query).reduce((queryObject, key) => {
    queryObject[key] = decodeURIComponent(req.query[key])
    return queryObject
  }, {})

  getAcronyms(req.mongo, MONGO_DB_COLLECTION, query)
    .then(succ => req.handleSuccess(succ, res))
    .catch(error => next(error))
})

/* POST new acronym */
router.post('/', function (req, res, next) {
  verifyPresentParams(['acronym', 'definition'], {...req.body})
    .then(() => {
      const acronym = {
        acronym: req.body.acronym,
        definition: req.body.definition
      }

      addAcronym(req.mongo, MONGO_DB_COLLECTION, acronym)
        .then(succ => req.handleSuccess(succ, res))
        .catch(error => next(error))
    })
    .catch(error => next(error))
})

/* Update acronym */
router.put('/:acronym', function (req, res, next) {
  getAuthenticationToken(req)
    .then((token) => {
      verifyPresentParams(['acronym', 'definition'], {...req.params, ...req.body})
        .then(() => {
          const acronym = {
            acronym: decodeURIComponent(req.params.acronym),
            definition: req.body.definition
          }

          updateAcronym(req.mongo, MONGO_DB_COLLECTION, acronym)
            .then(succ => req.handleSuccess(succ, res))
            .catch(error => next(error))
        })
        .catch(error => next(error))
    })
    .catch(error => next(error))
})

/* DELETE acronym */
router.delete('/:acronym', function (req, res, next) {
  getAuthenticationToken(req)
    .then((token) => {
      verifyPresentParams(['acronym'], {...req.params})
        .then(() => {
          deleteAcronym(req.mongo, MONGO_DB_COLLECTION, decodeURIComponent(req.params.acronym))
            .then(succ => req.handleSuccess(succ, res))
            .catch(error => next(error))
        })
        .catch(error => next(error))
    })
    .catch(error => next(error))
})

/* GET acronym */
router.get('/:acronym', function (req, res, next) {
  verifyPresentParams(['acronym'], {...req.params})
    .then(() => {
      getAcronym(req.mongo, MONGO_DB_COLLECTION, decodeURIComponent(req.params.acronym))
        .then(succ => req.handleSuccess(succ, res))
        .catch(error => next(error))
    })
    .catch(error => next(error))
})

/* POST fill database with initial acronym list */
router.post('/initialize-list', function (req, res, next) {
  insertBaseAcronyms(req.mongo)
    .then(succ => req.handleSuccess(succ, res))
    .catch(error => next(error))
})

export default router
