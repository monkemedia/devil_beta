import Cookie from 'js-cookie'
import api from '~/api'

const state = () => ({
  token: null,
  customerId: null
})

const mutations = {
  SET_TOKEN (store, data) {
    store.token = data
  },

  SET_CUSTOMER_ID (store, data) {
    store.customerId = data
  },

  CLEAR_TOKEN (store) {
    store.token = null
  },

  CLEAR_CUSTOMER_ID (store) {
    store.customerId = null
  }
}

const actions = {
  initAuth ({ dispatch, commit, getters }, req) {
    let token
    let customerId
    let username
    let merchantType

    if (req) {
      if (!req.headers.cookie) {
        return
      }
      const tokenCookie = req.headers.cookie
        .split(';')
        .find(c => c.trim().startsWith('token='))

      if (!tokenCookie) {
        return
      }

      const customerIdCookie = req.headers.cookie
        .split(';')
        .find(c => c.trim().startsWith('customerId='))

      const usernameCookie = req.headers.cookie
        .split(';')
        .find(c => c.trim().startsWith('username='))

      const merchantTypeCookie = req.headers.cookie
        .split(';')
        .find(c => c.trim().startsWith('merchantType='))

      token = tokenCookie.split('=')[1]
      customerId = customerIdCookie.split('=')[1]
      username = usernameCookie.split('=')[1]
      merchantType = merchantTypeCookie.split('=')[1]
    } else {
      token = localStorage.getItem('token')
      customerId = localStorage.getItem('customerId')
      username = localStorage.getItem('username')
      merchantType = localStorage.getItem('merchantType')
    }
    if (!token) {
      console.log('No token')
      dispatch('logout')
      return
    }

    commit('SET_TOKEN', token)
    commit('SET_CUSTOMER_ID', customerId)
    commit('user/SET_USERNAME', username, { root: true })
    commit('user/SET_MERCHANT_TYPE', merchantType, { root: true })
  },

  login ({ commit, dispatch }, data) {
    return api.auth.login(data)
      .then(response => {
        commit('SET_TOKEN', response.data.data.token)
        commit('SET_CUSTOMER_ID', response.data.data.customer_id)

        localStorage.setItem('token', response.data.data.token)
        localStorage.setItem('customerId', response.data.data.customer_id)

        Cookie.set('token', response.data.data.token)
        Cookie.set('customerId', response.data.data.customer_id)

        return response
      })
      .then((response) => {
        return dispatch('user/user', {
          customer_id: response.data.data.customer_id,
          customer_token: response.data.data.token
        }, { root: true })
      })
  },

  logout ({ commit }) {
    commit('CLEAR_TOKEN')
    commit('CLEAR_CUSTOMER_ID')
    commit('user/CLEAR_USERNAME', null, { root: true })
    commit('user/CLEAR_MERCHANT_TYPE', null, { root: true })

    Cookie.remove('token')
    Cookie.remove('customerId')
    Cookie.remove('username')
    Cookie.remove('merchantType')
    if (process.client) {
      localStorage.removeItem('token')
      localStorage.removeItem('customerId')
      localStorage.removeItem('username')
      localStorage.removeItem('merchantType')
    }
  }
}

const getters = {
  getMoltinCredentials (state) {
    return state.moltin
  },

  isAuthenticated (state) {
    return !!state.token
  },

  getToken (state) {
    return state.token
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
