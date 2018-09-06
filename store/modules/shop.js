import api from '~/api'

const state = () => ({
  loadedShop: null
})

const mutations = {
  SET_SHOP (state, product) {
    state.loadedShop = product
  }
}

const actions = {
  createShop ({ commit }, data) {
    console.log('creating shop', data)

    return api.shop.createShop(data)
      .then(res => {
        console.log('created shop res', res)
        commit('SET_SHOP', res.data.shop)
        return res
      })
      .catch(err => {
        throw err
      })
  },

  fetchShop ({ commit }, shopId) {
    return api.shop.fetchShop(shopId)
      .then(res => {
        commit('SET_SHOP', res.data.shop)
        return res
      })
      .catch(err => {
        throw err.message
      })
  }
}

const getters = {
  loadedShop (state) {
    return state.loadedShop
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
