import Cookie from 'js-cookie'
import api from '~/api'

const state = () => ({
  username: null,
  shopId: null,
  vendor: null
})

const mutations = {
  SET_USERNAME (state, username) {
    state.username = username
  },

  CLEAR_USERNAME (state) {
    state.username = null
  },

  SET_SHOP_ID (state, shopId) {
    state.shopId = shopId
  },

  CLEAR_SHOP_ID (state) {
    state.shopId = null
  },

  SET_VENDOR_TYPE (state, vendor) {
    state.vendor = vendor
  },

  CLEAR_VENDOR_TYPE (state) {
    state.vendor = null
  }
}

const actions = {
  user ({ commit }, data) {
    return api.user.user(data)
      .then(response => {
        console.log(response)
        localStorage.setItem('username', response.data.username)
        localStorage.setItem('shopId', response.data.shopId)
        localStorage.setItem('vendor', response.data.vendor)

        Cookie.set('username', response.data.username)
        Cookie.set('shopId', response.data.shopId)
        Cookie.set('vendor', response.data.vendor)

        commit('SET_USERNAME', response.data.username)
        commit('SET_SHOP_ID', response.data.shopId)
        commit('SET_VENDOR_TYPE', response.data.vendor)
      })
  },

  getCartReferences ({}, data) {
    return api.user.getCartReferences(data)
  },

  updateCartReferences ({ commit }, data) {
    return api.user.updateCartReferences(data)
  }
}

const getters = {
  username (state) {
    return state.username
  },

  vendor (state) {
    return state.vendor
  },

  shopId (state) {
    return state.shopId
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
