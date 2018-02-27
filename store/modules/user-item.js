import { key } from 'firebase-key'

const store = {
  namespaced: true,

  state: {
    loadedUserItem: null,
    userItemError: false
  },

  mutations: {
    SET_USER_ITEM (state, userItem) {
      state.loadedUserItem = userItem
    },

    SET_ERROR (state, isError) {
      state.userItemError = isError
    }
  },

  actions: {
  },

  getters: {
    loadedUserItem (state) {
      return state.loadedUserItem
    },

    isError (state) {
      return state.userItemError
    }
  }
}

export default store