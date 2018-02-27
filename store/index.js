import Vuex from 'vuex'
import auth from './modules/auth.js'
import addItem from './modules/add-item.js'
import userItem from './modules/user-item.js'

const createStore = () => {
  return new Vuex.Store({
    modules: {
      auth,
      addItem,
      userItem
    }
  })
}

export default createStore