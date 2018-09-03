// import Vue from 'vue'
// import _ from 'lodash'
import Cookie from 'js-cookie'
import cookie from 'cookie'
// import api from '~/api'
// import uuidv4 from 'uuid/v4'

const state = () => ({
  cartItems: []
})

const mutations = {
  PUSH_PRODUCT_TO_CART (state, product) {
    state.cartItems.push(product)
  },

  ADD_PRODUCT_TO_CART (state, product) {
    state.cartItems = product
  },

  INCREMENT_ITEM_QUANTITY (state, product) {
    const cartItem = state.cartItems.find(item => item.product._id === product.product._id)
    cartItem.quantity += product.quantity
  },

  CLEAR_CART_ITEMS (state) {
    state.cartItems = []
  }
}

const actions = {
  addToCart ({ state, commit }, product) {
    if (product.product.stock > 0) {
      const cartItem = state.cartItems.find(item => item.product._id === product.product._id)
      if (!cartItem) {
        commit('PUSH_PRODUCT_TO_CART', product)
      } else {
        if (cartItem.quantity >= product.product.stock) {
          console.log('No Stock')
          return
        }
        commit('INCREMENT_ITEM_QUANTITY', product)
      }
      // Update local storage
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
      Cookie.set('cartItems', JSON.stringify(state.cartItems))
    } else {
      console.log('no stock')
    }
  },

  fetchCartData ({ commit }, context) {
    let cartItems
    if (process.client) {
      cartItems = localStorage.getItem('cartItems')
      commit('ADD_PRODUCT_TO_CART', JSON.parse(cartItems) || [])
      return cartItems
    }

    if (context.req.headers.cookie && cookie.parse(context.req.headers.cookie)['cartItems']) {
      cartItems = cookie.parse(context.req.headers.cookie)['cartItems']
      commit('ADD_PRODUCT_TO_CART', JSON.parse(cartItems) || null)
      return cartItems
    }
  }
}

const getters = {
  loadedCartItems (state) {
    return state.cartItems
  },

  cartTotalItems (state) {
    const calculate = state.cartItems.reduce((a, b) => {
      return {
        quantity: a.quantity + b.quantity
      }
    }, { quantity: 0 })

    return calculate.quantity
  },

  cartSubtotal (state) {
    if (state.cartItems) {
      return state.cartItems.reduce((a, b) => {
        return a + (b.quantity * b.product.price.amount)
      }, 0)
    }
    return 0
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
