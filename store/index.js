import Vuex         from 'vuex'
import auth         from './modules/auth.js'
import sellersItems from './modules/sellers-items.js'
import cart         from './modules/cart.js'
import modals       from './modules/modals.js'
import navigation   from './modules/navigation.js'

const createStore = () => {
  return new Vuex.Store({
    modules: {
      auth,
      sellersItems,
      cart,
      modals,
      navigation
    },
    actions: {
      async nuxtServerInit({ dispatch }) {
        await dispatch('cart/fetchCartData')
      }
    }
  })
}

export default createStore