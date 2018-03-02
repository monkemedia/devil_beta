import Cookie from 'js-cookie'

const store = {
  namespaced: true,

  state: {
    cartItems: null,
    liveStock: null
  },

  mutations: {
    SET_CART (state, payload) {
      state.cartItems = payload
    },

    SET_LIVE_STOCK (state, payload) {
      state.liveStock = payload
    },

    CLEAR_CART (state) {
      state.cartItems = null
    },
  },

  actions: {
    addToCart ({ commit, rootGetters }, cartData) {
      localStorage.setItem('cart', JSON.stringify(cartData))
      const obj = JSON.stringify(cartData)
      Cookie.set('cart', obj)
      commit('SET_CART', cartData)
    },

    initCart (vuexContext, req) {
      let cart

      if (req) {
        if (!req.headers.cookie) {
          vuexContext.commit('CLEAR_CART')
          return
        }

        let cartCookie = req.headers.cookie
          .split(';')
          .find(c => c.trim().startsWith('cart='))
        
        if (!cartCookie) {
          return
        }
        cart = cartCookie.split('=')[1]
      } else if (process.client) {
        cart = localStorage.getItem('cart')
      }

      const cartCleaned = cart.replace(/%22/g,'"').replace(/%2C/g,',')

      vuexContext.commit('SET_CART', JSON.parse(cartCleaned))
    },

    liveStock ({ commit }, payload) {
      const category = payload.category
      const productId = payload.product_id
      this.$axios.$get(`${process.env.BASE_URL}/categories/${category}/${productId}/stock.json`)
        .then((stock) => {
          commit('SET_LIVE_STOCK', stock)
          return stock
        })
        .catch((err) => {
          throw err
        })
    }
  },

  getters: {
    liveStock (state) {
      return state.liveStock
    },

    cartItems (state) {
      return state.cartItems
    },

    cartTotalItems: (state) => {
      // const total = state.cartItems.reduce((a, b) => {
      //   return {
      //     quantity: a.quantity + b.quantity
      //   }
      // }, { quantity: 0 })

      // return total.quantity
    }
  }
}

export default store