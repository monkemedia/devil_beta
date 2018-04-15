const store = {
  namespaced: true,

  state: {
    shipping: null
  },

  mutations: {
    SET_SHIPPING_DATA (state, payload) {
      state.shipping = payload
    }
  },

  actions: {
    getShippingData ({ commit, rootGetters }) {
      console.log('HERE')
      const token = rootGetters['auth/token']
      const uid = rootGetters['auth/userId']

      return this.$axios.$get(`${process.env.FB_URL}/users/${uid}/address.json?auth=${token}`)
        .then((response) => {
          console.log('monkey', response)
          commit('SET_SHIPPING_DATA', response)
          return response
        })
    },

    saveShippingData ({ commit, rootGetters }, shippingData) {
      const token = rootGetters['auth/token']
      const uid = rootGetters['auth/userId']

      return this.$axios.$patch(`${process.env.FB_URL}/users/${uid}.json?auth=${token}`, { address: shippingData })
        .then((response) => {
          commit('SET_SHIPPING_DATA', { address: response })
          return response
        })
    }
  },

  getters: {
    loadedShippingData (state) {
      return state.shipping
    }
  }
}

export default store
