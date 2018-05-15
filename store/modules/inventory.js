import api from '~/api'

const state = () => ({
  stock: null
})

const mutations = {
  SET_STOCK (state, stock) {
    state.stock = stock
  }
}

const actions = {
  stock ({ commit }, productId) {
    return api.inventory.stock(productId)
      .then(res => {
        commit('SET_STOCK', res)
        return res
      })
      .catch(err => {
        throw err
      })
  }
}

const getters = {
  stock (state) {
    return state.stock
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
