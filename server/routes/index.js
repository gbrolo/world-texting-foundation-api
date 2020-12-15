import express from 'express'
import { invertText } from '../providers/invertions'
import { verifyPresentParams } from '../providers/paramChecker'
const router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Invert-API' })
})

/* GET random acronym */
router.get('/random/:count', function (req, res, next) {
  res.status(200).json({
    random: []
  })
})

export default router
