const store = {
  namespaced: true,

  state: {
    isMobileMenuOpen: false,
    isAdminMobileMenuOpen: false
  },

  mutations: {
    SET_MOBILE_MENU_TOGGLE (state, payload) {
      state.isMobileMenuOpen = payload
    },

    SET_ADMIN_MOBILE_MENU_TOGGLE (state, payload) {
      state.isAdminMobileMenuOpen = payload
    }
  },

  getters: {
    isMobileMenuOpen: (state) => {
      return state.isMobileMenuOpen
    },
    isAdminMobileMenuOpen: (state) => {
      return state.isAdminMobileMenuOpen
    }
  }
}

export default store
