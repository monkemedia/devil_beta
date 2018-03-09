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
      async nuxtServerInit ({ rootGetters }, context) {
        const isAuthenticated = rootGetters['auth/isAuthenticated']
        const isAnonAuthenticated = rootGetters['cart/isAnonAuthenticated']

        console.log('isAuthenticated', isAuthenticated)
        console.log('isAnonAuthenticated', isAnonAuthenticated)
        //if ()
        // return context.app.$axios.$get(`${process.env.BASE_URL}/products/${productId}.json`)
        //   .then(() => {

        //   })
      },
    }
  })
}

export default createStore