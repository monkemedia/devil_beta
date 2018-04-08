const store = {
  namespaced: true,

  state: {
  },

  mutations: {
  },

  actions: {
    saveShippingData (token, uid) {
      return this.$axios.$put(`${process.env.FB_URL}/users/${uid}/shippingAddress.json?auth=${token}`)
    }
  },

  getters: {
  }
}

export default store
