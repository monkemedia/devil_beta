import Vuex         from 'vuex'
import auth         from './modules/auth.js'
import sellersItems from './modules/sellers-items.js'
import cart         from './modules/cart.js'
import modals       from './modules/modals.js'
import navigation   from './modules/navigation.js'
import _            from 'lodash'
import axios        from 'axios'

const createStore = () => {
  return new Vuex.Store({
    modules: {
      auth,
      sellersItems,
      cart,
      modals,
      navigation
    }
  })
}

export default createStore