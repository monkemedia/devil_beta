const { Router } = require('express')

const moltin = require('./moltin.js')
const stripe = require('./stripe.js')

const router = Router()

router.use(moltin)
router.use(stripe)

module.exports = router
