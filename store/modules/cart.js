const store = {
  namespaced: true,

  state: {
    liveStock: null
  },

  mutations: {
    LIVE_STOCK (state, payload) {
      state.liveStock = payload
    }
  },

  actions: {
    liveStock ({ commit }, payload) {
      const category = payload.category
      const productId = payload.product_id
      this.$axios.$get(`${process.env.BASE_URL}/categories/${category}/${productId}/stock.json`)
        .then((stock) => {
          commit('LIVE_STOCK', stock)
          return stock
        })
        .catch((err) => {
          throw err
        })
    }
  },

  getters: {
    liveStock (state) {
      return state.liveStock
    }
  }
}

export default store