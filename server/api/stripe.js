const { Router } = require('express')
const stripe = require("stripe")(
  "sk_test_h6JCY8bTshgzwjeucvlzgDjI"
)

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

/* GET user by ID. */
// router.get('/users/:id', function (req, res, next) {
//   const id = parseInt(req.params.id)
//   if (id >= 0 && id < users.length) {
//     res.json(users[id])
//   } else {
//     res.sendStatus(404)
//   }
// })

module.exports = router
