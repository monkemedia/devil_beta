const pkg = require('./package')
const webpack = require('webpack')

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
      { rel: 'manifest', href: '/site.webmanifest' },
      { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#d61e38' },
      { name: 'apple-mobile-web-app-title', content: 'Devil Panties' },
      { name: 'application-name', content: 'Devil Panties' },
      { name: 'msapplication-TileColor', content: '#d61e38' },
      { name: 'theme-color', content: '#ffffff' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: false,

  /*
  ** Global CSS
  */
  css: [
    { src: '@/assets/css/main.styl', lang: 'styl' }
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/mixins',
    '~/plugins/buefy'
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    'nuxt-fontawesome'
  ],

  /*
  ** Axios module configuration
  */
<!--   axios: {
    BASE_URL: process.env.BASE_URL || 'https://devil-panties.firebaseio.com',
    credentials: false
  }, -->

  /*
  ** Build configuration
  */
  build: {
    postcss: {
      plugins: {
        'postcss-cssnext': {
          features: {
            customProperties: false
          }
        }
      }
    },
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  env: {
    BASE_URL: process.env.BASE_URL || 'https://devil-panties.firebaseio.com',
    FB_API_KEY: 'AIzaSyC-Xk_nslLHB2R-71P4E-r3w9jKTv58k0U'
  },
}
