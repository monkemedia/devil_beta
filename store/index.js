import Vuex from 'vuex'
import auth from './modules/auth.js'
import addItem from './modules/add-item.js'

const createStore = () => {
  return new Vuex.Store({
    modules: {
      auth,
      addItem
    }
  })
}

export default createStore