import express from 'express'
import { MONGO_DB_COLLECTION } from '../../db/consts'
import { insertBaseAcronyms } from '../../db/insertions'
import { addAcronym, getAcronym, getAcronyms } from '../../db/providers/acronyms'
import { verifyPresentParams } from '../../providers/paramChecker'
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
  res.status(200).json({
    updated: true
  })
})

/* DELETE acronym */
router.delete('/:acronym', function (req, res, next) {
  res.status(200).json({
    deleted: true
  })
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
