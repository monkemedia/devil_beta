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

  CLEAR_MERCHANT_TYPE (state) {
    state.merchantType = null
  }
}

const actions = {
  user ({ commit }, data) {
    return api.user(data)
      .then(response => {
        localStorage.setItem('username', response.data.data.username)
        localStorage.setItem('merchantType', response.data.data.merchantType)

        Cookie.set('username', response.data.data.username)
        Cookie.set('merchantType', response.data.data.merchantType)

        commit('SET_USERNAME', response.data.data.username)
        commit('SET_MERCHANT_TYPE', response.data.data.merchantType)
      })
  }
}

const getters = {
  username (state) {
    return state.username
  },

  merchant (state) {
    return state.merchantType
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
