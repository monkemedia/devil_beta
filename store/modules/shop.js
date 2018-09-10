import api from '~/api'

const state = () => ({
  loadedShop: null,
  shopProgress: null
})

const mutations = {
  SET_SHOP (state, product) {
    state.loadedShop = product
  },

  SET_SHOP_PROGRESS (state, progress) {
    state.shopProgress = progress
  }
}

const actions = {
  createShop ({ commit }, data) {
    console.log('creating shop', data)

    return api.shop.createShop(data)
      .then(res => {
        console.log('created shop res', res)
        commit('SET_SHOP', res.data.shop)
        commit('SET_SHOP_PROGRESS', res.data.progress)
        return res
      })
      .catch(err => {
        throw err
      })
  },

  updateShop ({ commit }, data) {
    return api.shop.updateShop(data)
      .then(res => {
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
        commit('SET_SHOP_PROGRESS', res.data.progress)
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
  },

  shopProgress (state) {
    return state.shopProgress
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
