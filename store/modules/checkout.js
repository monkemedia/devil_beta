const store = {
  namespaced: true,

  state: {
    address: null
  },

  mutations: {
    SET_SHIPPING_DATA (state, payload) {
      state.address = payload
    }
  },

  actions: {
    getShippingData ({ commit, rootGetters }) {
      const token = rootGetters['auth/token']
      const uid = rootGetters['auth/uid']

      return this.$axios.$get(`${process.env.FB_URL}/users/${uid}/address.json?auth=${token}`)
        .then((response) => {
          commit('SET_SHIPPING_DATA', response)
          return response
        })
    },

    getShippingMethodData ({ commit, rootGetters }, uid) {
      const token = rootGetters['auth/token']

      return this.$axios.$get(`${process.env.FB_URL}/users/${uid}/shippingMethods.json?auth=${token}`)
        .then((response) => {
          return response
        })
    },

    saveShippingData ({ commit, rootGetters }, shippingData) {
      const token = rootGetters['auth/token']
      const uid = rootGetters['auth/uid']

      return this.$axios.$patch(`${process.env.FB_URL}/users/${uid}/address.json?auth=${token}`, shippingData)
        .then((response) => {
          commit('SET_SHIPPING_DATA', shippingData)
          return response
        })
    }
  },

  getters: {
    loadedShippingData (state) {
      return state.address
    }
  }
}

export default store
