const express = require('express')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

app.set('port', port)

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    const wwwhisper = require('connect-wwwhisper')
    await builder.build()
    app.use(wwwhisper())
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
   app.get('/', (request, response) => {
    const result = 'App is running'
    response.send(result);
  })
    .listen(app.get('port'), () => {
        console.log('App is running, server is listening on port ', app.get('port'));
    })
}
start()
