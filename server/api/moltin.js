require('dotenv').config()
const { Router } = require('express')

const router = Router()

/* GET users listing. */
router.post('/create-account', (req, res, next) => {
  stripe.accounts.create({
    type: 'custom',
    country: 'GB',
    email: 'bob@example.com'
  }, (err, account) => {
    // asynchronously called
    if (err) {
      console.log('ERROR', err)
    }
    res.json(account)
  });
  
})

module.exports = router
