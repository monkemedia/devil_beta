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
    let shopId

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

      const shopIdCookie = req.headers.cookie
        .split(';')
        .find(c => c.trim().startsWith('shopId='))

      token = tokenCookie.substring(tokenCookie.indexOf('=') + 1) // Using this method as tokens contain more than 1 equals (=) sign
      username = usernameCookie.split('=')[1]
      vendor = vendorCookie.split('=')[1]
      shopId = shopIdCookie.split('=')[1]
    } else {
      token = localStorage.getItem('token')
      username = localStorage.getItem('username')
      vendor = localStorage.getItem('vendor')
      shopId = localStorage.getItem('shopId')
    }
    if (!token) {
      console.log('No token')
      dispatch('logout')
      return
    }

    commit('SET_TOKEN', token)
    commit('user/SET_USERNAME', username, { root: true })
    commit('user/SET_VENDOR_TYPE', vendor, { root: true })
    commit('user/SET_SHOP_ID', shopId, { root: true })
  },

  setAuthData ({ commit }, data) {
    commit('SET_TOKEN', data.token)
    commit('user/SET_USERNAME', data.username, { root: true })
    commit('user/SET_VENDOR_TYPE', data.vendor, { root: true })
    commit('user/SET_SHOP_ID', data.shopId, { root: true })

    Cookie.set('token', data.token)
    Cookie.set('refreshToken', data.refreshToken)
    Cookie.set('username', data.username)
    Cookie.set('userId', data.userId)
    Cookie.set('vendor', data.vendor)
    Cookie.set('shopId', data.shopId)

    if (process.client) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('refreshToken', data.refreshToken)
      localStorage.setItem('username', data.username)
      localStorage.setItem('userId', data.userId)
      localStorage.setItem('vendor', data.vendor)
      localStorage.setItem('shopId', data.shopId)
    }
  },

  login ({ rootGetters, commit, dispatch }, data) {
    return api.auth.login(data)
      .then(res => {
        return dispatch('setAuthData', {
          token: res.data.token,
          refreshToken: res.data.refresh_token,
          username: res.data.username,
          userId: res.data._id,
          vendor: res.data.vendor,
          shopId: res.data.shop_id
        })
      })
  },

  register ({ dispatch }, data) {
    // If vendor equals true, we create a shop for them
    return dispatch('shop/createShop', data, { root: true })
      .then(shopId => {
        return api.auth.register({ ...data, shop_id: shopId.data.shop._id })
      })
  },

  logout ({ dispatch, commit }, req) {
    commit('CLEAR_TOKEN')
    commit('user/CLEAR_USERNAME', null, { root: true })
    commit('user/CLEAR_VENDOR_TYPE', null, { root: true })
    commit('user/CLEAR_SHOP_ID', null, { root: true })

    // if (req) {
    //   console.log('LOGGING OUT', req)
    // }

    Cookie.remove('token')
    Cookie.remove('refreshToken')
    Cookie.remove('username')
    Cookie.remove('userId')
    Cookie.remove('vendor')
    Cookie.remove('shopId')

    // Clear all moltin data

    if (process.client) {
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('username')
      localStorage.removeItem('userId')
      localStorage.removeItem('vendor')
      localStorage.removeItem('shopId')
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
