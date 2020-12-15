import express from 'express'
import { insertBaseAcronyms } from '../../db/insertions'
const router = express.Router()

/* GET acronyms list */
router.get('/', function (req, res, next) {
  res.status(200).json({
    acronyms: []
  })
})

/* POST new acronym */
router.post('/', function (req, res, next) {
  res.status(200).json({
    acronyms: []
  })
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
  res.status(200).json({
    acronym: '?',
    definition: 'I don\'t understand what you mean'
  })
})

/* POST fill database with initial acronym list */
router.post('/initialize-list', function (req, res, next) {
  insertBaseAcronyms(req.mongo)
    .then(succ => req.handleSuccess(succ, res))
    .catch(error => next(error))
})

export default router
