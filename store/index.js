import Vuex from 'vuex'
import auth from './modules/auth.js'
import user from './modules/user.js'
import products from './modules/products.js'
import cart from './modules/cart.js'
import modals from './modules/modals.js'
import navigation from './modules/navigation.js'
import checkout from './modules/checkout.js'

export default () => {
  return new Vuex.Store({
    modules: {
      auth,
      user,
      products,
      cart,
      modals,
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
