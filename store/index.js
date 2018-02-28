import Vuex         from 'vuex'
import auth         from './modules/auth.js'
import sellersItems from './modules/sellers-items.js'
import cart         from './modules/cart.js'

const createStore = () => {
  return new Vuex.Store({
    modules: {
      auth,
      sellersItems,
      cart
    }
  })
}

export default createStore