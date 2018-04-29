const state = () => ({
  isMobileMenuOpen: false,
  isAdminMobileMenuOpen: false
})

const mutations = {
  SET_MOBILE_MENU_TOGGLE (state, payload) {
    state.isMobileMenuOpen = payload
  },

  SET_ADMIN_MOBILE_MENU_TOGGLE (state, payload) {
    state.isAdminMobileMenuOpen = payload
  }
}

const getters = {
  isMobileMenuOpen: (state) => {
    return state.isMobileMenuOpen
  },
  isAdminMobileMenuOpen: (state) => {
    return state.isAdminMobileMenuOpen
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}
