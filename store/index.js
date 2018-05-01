import Vuex from 'vuex'
import auth from './modules/auth.js'
import moltin from './modules/moltin.js'
import user from './modules/user.js'
import anonAuth from './modules/anonAuth.js'
import products from './modules/products.js'
import cart from './modules/cart.js'
import modals from './modules/modals.js'
import navigation from './modules/navigation.js'
import checkout from './modules/checkout.js'

export default () => {
  return new Vuex.Store({
    modules: {
      auth,
      moltin,
      user,
      anonAuth,
      products,
      cart,
      modals,
      navigation,
      checkout
    },
    actions: {
      async nuxtServerInit ({ rootGetters, dispatch }, context) {
        console.log('moltin')
        return dispatch('moltin/credentials')
      }
    }
  })
}
