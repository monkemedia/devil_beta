import Cookie from 'js-cookie'

const store = {
  namespaced: true,

  state: {
    cartItems: [],
    liveStock: null
  },

  mutations: {
    SET_CART_PUSH (state, payload) {
      state.cartItems.push(payload)
    },

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
    addToCart ({ state, commit }, cartData) {
      let itemArray
      let cookieCart = JSON.parse(localStorage.getItem('cart'))
      const record = state.cartItems.find(element => element.item.product_id === cartData.item.product_id)

      function addItemToCookie (item) {
        if (cookieCart) {
          cookieCart.push(item)
          localStorage.setItem('cart', JSON.stringify(cookieCart))
          Cookie.set('cart', cookieCart)
        } else {
          itemArray = []
          itemArray.push(item)
          localStorage.setItem('cart', JSON.stringify(itemArray))
          Cookie.set('cart', itemArray)
        }
      }

      function updateItemInCookie (id) {
        console.log('UPDATE COOKIE', cookieCart)
        cookieCart.map((element) => {
          if (element.item.product_id === id) {
            element.quantity += cartData.quantity
          }
          return element
        })
        localStorage.setItem('cart', JSON.stringify(cookieCart))
        state.cartItems = cookieCart
        Cookie.set('cart', cookieCart)
      }

      if (record) { // Product is already in cart so just change quantity
        updateItemInCookie(cartData.item.product_id)
        commit('SET_CART', cookieCart)
      } else {
        const data = {
          ...cartData,
          quantity: cartData.quantity
        }
        commit('SET_CART_PUSH', data)
        addItemToCookie(data)
      }
    },

    initCart (vuexContext, req) {
      console.log('HERE')
      let cart
      let cartCleaned

      if (req) {
        let cartCookie = req.headers.cookie
          .split(';')
          .find(c => c.trim().startsWith('cart='))
        
        if (!cartCookie) {
          return
        }
        cart = cartCookie.split('=')[1]
        cartCleaned = cart.replace(/%22/g,'"').replace(/%2C/g,',')
        console.log('cartcLEANED', JSON.parse(cartCleaned))
        vuexContext.commit('SET_CART', JSON.parse(cartCleaned))
      } else if (process.client) {
        cart = localStorage.getItem('cart')
        vuexContext.commit('SET_CART', JSON.parse(cart))
      }
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
      const total = state.cartItems.reduce((a, b) => {
        return {
          quantity: a.quantity + b.quantity
        }
      }, { quantity: 0 })

      return total.quantity
    },

    cartSubtotal: (state) => {
      return state.cartItems.reduce((a, b) => {
        const isOnSale = b.item.on_sale

        function price () {
          if (isOnSale) {
            return b.item.sale_price
          }
          return b.item.price
        }
        return a + price() * b.quantity
      }, 0)
    }
  }
}

export default store