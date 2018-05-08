import Cookie from 'js-cookie'
import api from '~/api'
// import axios from 'axios'

const state = () => ({
  accessToken: null
})

const mutations = {
  SET_MOLTIN_ACCESS_TOKEN (state, data) {
    state.accessToken = data
  },

  CLEAR_MOLTIN_ACCESS_TOKEN (state) {
    state.accessToken = null
  }
}

const actions = {
  credentials ({ commit }) {
    const payload = {
      client_id: process.env.MOLTIN_CLIENT_ID,
      client_secret: process.env.MOLTIN_CLIENT_SECRET,
      grant_type: 'client_credentials'
    }

    return api.moltin.credentials(payload)
      .then(res => {
        commit('SET_MOLTIN_ACCESS_TOKEN', res.data.access_token)

        Cookie.set('moltin-access-token', res.data.access_token)

        console.log('new token', res.data.access_token)

        if (process.client) {
          localStorage.setItem('moltin-access-token', res.data.access_token)
        }

        return res.data.access_token
      })
      .catch(err => {
        console.log('ERROR', err)
      })
  },

  clearMoltinAccessToken ({ commit }) {
    commit('CLEAR_MOLTIN_ACCESS_TOKEN')
    localStorage.removeItem('moltin-access-token')
    Cookie.remove('moltin-access-token')
  }
}

const getters = {
  accessToken (state) {
    return state.accessToken
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
