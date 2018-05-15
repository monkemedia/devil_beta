import api from '~/api'
import axios from 'axios'

const state = () => ({
  token: null,
  expiry: null
})

const mutations = {
  SET_MOLTIN_TOKEN (state, data) {
    state.token = data
  },

  SET_MOLTIN_EXPIRY (state, data) {
    state.expiry = data
  },

  CLEAR_MOLTIN_TOKEN (state) {
    state.token = null
  },

  CLEAR_MOLTIN_EXPIRY (state) {
    state.expiry = null
  }
}

const actions = {
  setToken ({ commit }) {
    console.log('set token')
    const payload = {
      client_id: process.env.MOLTIN_CLIENT_ID,
      client_secret: process.env.MOLTIN_CLIENT_SECRET,
      grant_type: 'client_credentials'
    }

    return api.moltin.credentials(payload)
      .then(res => {
        console.log('set token 2')
        axios.defaults.headers.common['moltinAccessToken'] = res.data.access_token
        axios.defaults.headers.common['moltinExpiry'] = res.data.expires

        commit('SET_MOLTIN_TOKEN', res.data.access_token)
        commit('SET_MOLTIN_EXPIRY', res.data.expires)

        if (process.client) {
          localStorage.setItem('moltinAccessToken', res.data.access_token)
          localStorage.setItem('moltinExpiry', res.data.expires)
        }

        return res.data
      })
      .catch(err => {
        console.log('ERROR one', err)
        return err
      })
  },

  credentials ({ commit, dispatch, getters }, context) {
    console.log('CREDENTIALS', context.req.headers)

    const currentDate = Math.floor(new Date().getTime() / 1000)
    const accessToken = axios.defaults.headers.common['moltinAccessToken']
    const expiryToken = axios.defaults.headers.common['moltinExpiry']

    if (!accessToken) {
      return dispatch('setToken')
    }

    if (accessToken) {
      if (currentDate < expiryToken) {
        commit('SET_MOLTIN_TOKEN', accessToken)
        commit('SET_MOLTIN_EXPIRY', expiryToken)
      } else {
        return dispatch('setToken')
      }
    }
  },

  clearMoltinCredentials ({ commit }) {
    commit('CLEAR_MOLTIN_TOKEN')
    commit('CLEAR_MOLTIN_EXPIRY')

    delete axios.defaults.headers.common['moltinAccessToken']
    delete axios.defaults.headers.common['moltinExpiry']

    if (process.client) {
      localStorage.removeItem('moltinAccessToken')
      localStorage.removeItem('moltinExpiry')
    }
  }
}

const getters = {
  token (state) {
    return state.token
  },
  expiry (state) {
    return state.expiry
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
