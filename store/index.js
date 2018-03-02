import Vuex         from 'vuex'
import auth         from './modules/auth.js'
import sellersItems from './modules/sellers-items.js'
import cart         from './modules/cart.js'
import modals       from './modules/modals.js'

const createStore = () => {
  return new Vuex.Store({
    modules: {
      auth,
      sellersItems,
      cart,
      modals
    }
  })
}

export default createStore