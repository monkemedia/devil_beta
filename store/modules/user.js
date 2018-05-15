import Cookie from 'js-cookie'
import api from '~/api'

const state = () => ({
  username: null,
  merchantType: null
})

const mutations = {
  SET_USERNAME (state, username) {
    state.username = username
  },

  CLEAR_USERNAME (state) {
    state.username = null
  },

  SET_MERCHANT_TYPE (state, merchant) {
    state.merchantType = merchant
  },

  SET_CART_REFERENCE (state, reference) {
    state.reference = reference
  },

  CLEAR_MERCHANT_TYPE (state) {
    state.merchantType = null
  }
}

const actions = {
  user ({ commit }, data) {
    return api.user.user(data)
      .then(response => {
        localStorage.setItem('username', response.data.data.username)
        localStorage.setItem('merchantType', response.data.data.merchant_type)

        Cookie.set('username', response.data.data.username)
        Cookie.set('merchantType', response.data.data.merchant_type)

        commit('SET_USERNAME', response.data.data.username)
        commit('SET_MERCHANT_TYPE', response.data.data.merchant_type)
      })
  },

  cartReference ({ commit }, data) {
    return api.user.cartReference(data)
      .then(response => {
        localStorage.setItem('cartReference', response.data.data.cart_reference)

        Cookie.set('cartReference', response.data.data.cart_reference)

        commit('SET_CART_REFERENCE', response.data.data.cart_reference)
      })
  }
}

const getters = {
  username (state) {
    return state.username
  },

  merchant (state) {
    return state.merchantType
  },

  reference (state) {
    return state.reference
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
