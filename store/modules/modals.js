const state = () => ({
  isSearchBarOpen: false
})

const mutations = {
  SET_SEARCH_BAR (state, payload) {
    state.isSearchBarOpen = payload
  }
}

const getters = {
  isSearchBarOpen: (state) => {
    return state.isSearchBarOpen
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}
