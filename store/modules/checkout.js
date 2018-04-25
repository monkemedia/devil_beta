const store = {
  namespaced: true,

  state: {
    address: null,
    methods: null
  },

  mutations: {
    SET_SHIPPING_DATA (state, payload) {
      state.address = payload
    },

    SET_SHIPPING_METHOD_DATA (state, payload) {
      state.methods = payload
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

      console.log('UID', uid)

      return this.$axios.$get(`${process.env.FB_URL}/users/${uid}/shippingMethods.json?auth=${token}`)
        .then((response) => {
          console.log('response', response)
          commit('SET_SHIPPING_METHOD_DATA', response)
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
    },

    cartItems ({ state, rootGetters }) {
      const cartItems = rootGetters['cart/loadedCartItems']

      console.log(cartItems)
      return 'test'
    }
  },

  getters: {
    loadedShippingData (state) {
      return state.address
    },

    loadedShippingMethodData (state) {
      return state.methods
    }
  }
}

export default store
