const state = () => ({
  setupLoading: false
})

const mutations = {
  SET_SETUP_LOADING (state, payload) {
    state.setupLoading = payload
  }
}

const getters = {
  isSetupLoading: (state) => {
    return state.setupLoading
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}
