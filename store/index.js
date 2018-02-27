import Vuex from 'vuex'
import auth from './modules/auth.js'
import userItem from './modules/user-item.js'

const createStore = () => {
  return new Vuex.Store({
    modules: {
      auth,
      userItem
    }
  })
}

export default createStore