const { Router } = require('express')

const stripe = require('./stripe.js')

const router = Router()

// Add stripe Routes
router.use(stripe)

module.exports = router
