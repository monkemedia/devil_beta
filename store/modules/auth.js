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
    let cartReference

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

      const cartReferenceCookie = req.headers.cookie
        .split(';')
        .find(c => c.trim().startsWith('cartReference='))

      token = tokenCookie.substring(tokenCookie.indexOf('=') + 1) // Using this method as tokens contain more than 1 equals (=) sign
      customerId = customerIdCookie.split('=')[1]
      username = usernameCookie.split('=')[1]
      merchantType = merchantTypeCookie.split('=')[1]
      cartReference = cartReferenceCookie.split('=')[1]
    } else {
      token = localStorage.getItem('token')
      customerId = localStorage.getItem('customerId')
      username = localStorage.getItem('username')
      merchantType = localStorage.getItem('merchantType')
      cartReference = localStorage.getItem('cartReference')
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
    commit('user/SET_CART_REFERENCE', cartReference, { root: true })
  },

  setAuthData ({ commit }, data) {
    commit('SET_TOKEN', data.token)
    commit('SET_CUSTOMER_ID', data.customer_id)

    localStorage.setItem('token', data.token)
    localStorage.setItem('customerId', data.customer_id)

    Cookie.set('token', data.token)
    Cookie.set('customerId', data.customer_id)
  },

  login ({ rootGetters, dispatch }, data) {
    return api.auth.login(data)
      .then(res => {
        console.log('LOGIN RES', res.data.data)
        dispatch('setAuthData', {
          token: res.data.data.token,
          customer_id: res.data.data.customer_id
        })
        return res
      })
      .then(res => {
        console.log('3', res)
        return dispatch('user/user', {
          customer_id: res.data.data.customer_id,
          customer_token: res.data.data.token
        }, { root: true })
      })
  },

  register ({ dispatch }, data) {
    return api.auth.register(data)
      .then(() => {
        return dispatch('login', {
          email: data.email,
          password: data.password,
          type: 'token'
        })
      })
  },

  logout ({ dispatch, commit }, req) {
    commit('CLEAR_TOKEN')
    commit('CLEAR_CUSTOMER_ID')
    commit('user/CLEAR_USERNAME', null, { root: true })
    commit('user/CLEAR_MERCHANT_TYPE', null, { root: true })

    // if (req) {
    //   console.log('LOGGING OUT', req)
    // }

    Cookie.remove('token')
    Cookie.remove('customerId')
    Cookie.remove('username')
    Cookie.remove('merchantType')

    // Clear all moltin data

    if (process.client) {
      localStorage.removeItem('token')
      localStorage.removeItem('customerId')
      localStorage.removeItem('username')
      localStorage.removeItem('merchantType')
    }
  }
}

const getters = {
  isAuthenticated (state) {
    return !!state.token
  },

  getToken (state) {
    return state.token
  },

  getCustomerId (state) {
    return state.customerId
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
