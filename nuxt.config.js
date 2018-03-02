const pkg = require('./package')
const webpack = require('webpack')

// require('dotenv').config()

module.exports = {
  mode: 'universal',

  route: {
    middleware: [
      'check-auth', 
      'cart'
    ]
  },

  /*
  ** Headers of the page
  */
  head: {
    htmlAttrs: {
      lang: 'en',
    },
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    script: [
      { src: 'https://ucarecdn.com/libs/widget/3.2.1/uploadcare.full.min.js' },
      { innerHTML: "UPLOADCARE_PUBLIC_KEY = '78311196f07819e13fe9'", type: 'text/javascript', charset: 'utf-8' }
    ],
    __dangerouslyDisableSanitizers: ['script'],
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
    '~/plugins/buefy',
    '~/plugins/lazy-image',
    '~/plugins/currency',
    '~/plugins/slick'
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    '@nuxtjs/font-awesome'
  ],

  /*
  ** Axios module configuration
  */

  /*
  ** Build configuration
  */
  build: {
    plugins: [
      new webpack.ProvidePlugin ({
        '$': 'jquery',
        'jQuery': 'jquery'
      }),
    ],
    cssSourceMap: false,
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

      if (ctx.isServer) {
        config.externals = [
          require('webpack-node-externals')({
            whitelist: [/^vue-slick/]
          })
        ]
      }
    }
  },

  env: {
    BASE_URL: process.env.BASE_URL,
    FB_API_KEY: process.env.FB_API_KEY,
    UPLOADCARE_PUBLIC_KEY: process.env.UPLOADCARE_PUBLIC_KEY,
    UPLOADCARE_SECRET_KEY: process.env.UPLOADCARE_SECRET_KEY
  }
}
