import Vuex from 'vuex'
import auth from './modules/auth.js'

const createStore = () => {
  return new Vuex.Store({
    modules: {
      auth
    }
  })
}

export default createStore