import Cookie from 'js-cookie'
import api from '~/api'

const state = () => ({
  token: null
})

const mutations = {
  SET_TOKEN (store, data) {
    store.token = data
  },

  CLEAR_TOKEN (store) {
    store.token = null
  }
}

const actions = {
  initAuth ({ dispatch, commit, getters }, req) {
    let token
    let username
    let vendor

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

      const usernameCookie = req.headers.cookie
        .split(';')
        .find(c => c.trim().startsWith('username='))

      const vendorCookie = req.headers.cookie
        .split(';')
        .find(c => c.trim().startsWith('vendor='))

      token = tokenCookie.substring(tokenCookie.indexOf('=') + 1) // Using this method as tokens contain more than 1 equals (=) sign
      username = usernameCookie.split('=')[1]
      vendor = vendorCookie.split('=')[1]
    } else {
      token = localStorage.getItem('token')
      username = localStorage.getItem('username')
      vendor = localStorage.getItem('vendor')
    }
    if (!token) {
      console.log('No token')
      dispatch('logout')
      return
    }

    commit('SET_TOKEN', token)
    commit('user/SET_USERNAME', username, { root: true })
    commit('user/SET_MERCHANT_TYPE', vendor, { root: true })
  },

  setAuthData ({ commit }, data) {
    commit('SET_TOKEN', data.token)
    commit('SET_USERNAME', data.username)
    commit('SET_VENDOR', data.vendor)

    Cookie.set('token', data.token)
    Cookie.set('username', data.username)
    Cookie.set('vendor', data.vendor)

    if (process.client) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('username', data.username)
      localStorage.setItem('vendor', data.vendor)
    }
  },

  login ({ rootGetters, commit, dispatch }, data) {
    // commit('cart/CLEAR_CART_ITEMS', null, { root: true })

    return api.auth.login(data)
      .then(res => {
        console.log('LOGIN RES', res.data)
        dispatch('setAuthData', {
          token: res.data.token,
          username: res.data.username,
          vendor: res.data.vendor
        })
        return res
      })
      // .then(() => {
      //   const localCartReferences = localStorage.getItem('cartItems')

      //   if (localCartReferences) {
      //     return dispatch('cart/localStorageToMoltin', JSON.parse(localCartReferences), { root: true })
      //   }

      //   return dispatch('cart/fetchCartData', null, { root: true })
      //     .then(res => {
      //       _.map(res.data.data, item => {
      //         commit('cart/SET_CART_ITEMS', item, { root: true })
      //       })
      //     })
      // })
  },

  register ({ dispatch }, data) {
    return api.auth.register(data)
      .then(() => {
        return dispatch('login', {
          email: data.email,
          password: data.password,
          username: data.username,
          vendor: data.vendor,
          name: data.name
        })
      })
  },

  logout ({ dispatch, commit }, req) {
    commit('CLEAR_TOKEN')
    commit('user/CLEAR_USERNAME', null, { root: true })
    commit('user/CLEAR_MERCHANT_TYPE', null, { root: true })

    // if (req) {
    //   console.log('LOGGING OUT', req)
    // }

    Cookie.remove('token')
    Cookie.remove('username')
    Cookie.remove('vendor')

    // Clear all moltin data

    if (process.client) {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('vendor')
      localStorage.removeItem('cartItems')
    }
  }
}

const getters = {
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
