import Vuex         from 'vuex'
import auth         from './modules/auth.js'
import anonAuth     from './modules/anonAuth.js'
import sellersItems from './modules/sellers-items.js'
import cart         from './modules/cart.js'
import modals       from './modules/modals.js'
import navigation   from './modules/navigation.js'

const createStore = () => {
  return new Vuex.Store({
    modules: {
      auth,
      anonAuth,
      sellersItems,
      cart,
      modals,
      navigation
    },
    actions: {
      async nuxtServerInit({ dispatch }, context) {
        await dispatch('cart/fetchCartData', context.req)
      }
    }
  })
}

export default createStore
