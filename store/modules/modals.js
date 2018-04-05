const store = {
  namespaced: true,

  state: {
    isSearchBarOpen: false
  },

  mutations: {
    SET_SEARCH_BAR (state, payload) {
      state.isSearchBarOpen = payload
    }
  },

  getters: {
    isSearchBarOpen: (state) => {
      return state.isSearchBarOpen
    }
  }
}

export default store
