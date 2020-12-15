import express from 'express'
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



export default router
