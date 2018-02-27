import Vuex from 'vuex'
import auth from './modules/auth.js'
import sellersItems from './modules/sellers-items.js'

const createStore = () => {
  return new Vuex.Store({
    modules: {
      auth,
      sellersItems
    }
  })
}

export default createStore