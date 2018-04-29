import Vuex from 'vuex'
import auth from './modules/auth.js'
import moltin from './modules/moltin.js'
import user from './modules/user.js'
import anonAuth from './modules/anonAuth.js'
import sellersItems from './modules/sellers-items.js'
import cart from './modules/cart.js'
import modals from './modules/modals.js'
import navigation from './modules/navigation.js'
import checkout from './modules/checkout.js'

// Vue.use(Vuex)

export default () => {
  return new Vuex.Store({
    modules: {
      auth,
      moltin,
      user,
      anonAuth,
      sellersItems,
      cart,
      modals,
      navigation,
      checkout
    },
    actions: {
      async nuxtServerInit ({ dispatch }, context) {
        await dispatch('moltin/credentials')
      }
    }
  })
}
