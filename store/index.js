import Vuex from 'vuex'
import auth from './modules/auth.js'
import user from './modules/user.js'
import products from './modules/products.js'
import shop from './modules/shop.js'
import stripe from './modules/stripe.js'
import cart from './modules/cart.js'
import modals from './modules/modals.js'
import buttons from './modules/buttons.js'
import navigation from './modules/navigation.js'
import checkout from './modules/checkout.js'

export default () => {
  return new Vuex.Store({
    modules: {
      auth,
      user,
      products,
      shop,
      stripe,
      cart,
      modals,
      buttons,
      navigation,
      checkout
    },
    actions: {
      async nuxtServerInit ({ dispatch }, context) {
        return dispatch('cart/fetchCartData', context)
      }
    }
  })
}
