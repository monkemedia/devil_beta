import Cookies from 'js-cookie'

const store = {
  namespaced: true,

  state: {
    added: []
  },

  mutations: {
    PUSH_PRODUCT_TO_CART (state, product) {
      state.added.push({
        product_id: product.product_id,
        price: product.price,
        on_sale: product.on_sale,
        sale_price: product.sale_price,
        quantity: 1
      })
    },

    INCREMENT_ITEM_QUANTITY (state, product) {
      const cartItem = state.added.find(item => item.product_id === product.product_id)
      cartItem.quantity += product.quantity
    },

    SET_CART_ITEMS (state, items) {
      state.added = items
    }
  },

  actions: {
    addToDatabase ({ rootGetters }, payload) {
      const token = rootGetters['auth/token']
      const userId = rootGetters['auth/userId']
      const productId = payload.product_id

      return this.$axios.$put(`${process.env.BASE_URL}/cart/${userId}/${productId}.json?auth=${token}`, payload)
        .then((result) => {
          return result
        })
        .catch((err) => {
          throw err
        })
    },

    updateDatabase ({ state, rootGetters }, payload) {
      console.log('updateDatabase', payload)
      const token = rootGetters['auth/token']
      const userId = rootGetters['auth/userId']
      let cartItem

      return this.$axios.$get(`${process.env.BASE_URL}/cart/${userId}/${payload.product_id}.json?auth=${token}`)
        .then((result) => {
          result.quantity += payload.quantity
          return this.$axios.$patch(`${process.env.BASE_URL}/cart/${userId}/${payload.product_id}.json?auth=${token}`, { quantity: result.quantity })
        })
        .then((result) => {
          return result
        })
        .catch((err) => {
          throw err
        })
    },

    addToCart ({ state, dispatch, commit, rootGetters }, product) {
      const cartItem = state.added.find(item => item.product_id === product.product_id)
      const isAuthenticated = rootGetters['auth/isAuthenticated']

      function saveMethod (location, product) {
        commit(location, product)
        localStorage.setItem('cart', JSON.stringify(state.added))
        Cookies.set('cart', state.added)
      }

      if (!cartItem) {
        if (isAuthenticated) {
          saveMethod('PUSH_PRODUCT_TO_CART', product)
          return dispatch('addToDatabase', product)
            .then((result) => {
              return result
            })
            .catch((err) => {
              throw err
            })
        }

        saveMethod('PUSH_PRODUCT_TO_CART', product)
      } else {
        const payload = {
          cartItem,
          quantity: product.quantity
        }

        if (isAuthenticated) {
          saveMethod('INCREMENT_ITEM_QUANTITY', product)
          return dispatch('updateDatabase', product)
            .then((result) => {
              console.log('result', product)
              return result
            })
            .catch((err) => {
              console.log('ERROR', err)
              throw err
            })
        }

        saveMethod('INCREMENT_ITEM_QUANTITY', product)
      }
    },

    initCart (vuexContext, req) {
      const isAuthenticated = vuexContext.rootGetters['auth/isAuthenticated']
      let token
      let userId
      let cart

      if (req) {
        if (!req.headers.cookie) {
          return
        }

        let cartCookie = req.headers.cookie
          .split(';')
          .find(c => c.trim().startsWith('cart='))
        
        if (!cartCookie) {
          // if there is no cart cookie, then lets see if user has cart saved on database
          if (isAuthenticated) {
            token = vuexContext.rootGetters['auth/token']
            userId = vuexContext.rootGetters['auth/userId']
            this.$axios.$get(`${process.env.BASE_URL}/cart/${userId}.json?auth=${token}`)
              .then((result) => {
                console.log('user has cart on db' )
                const newArray = []
                Object.keys(result).forEach((item) => {
                  newArray.push(result[item])
                })
                vuexContext.commit('SET_CART_ITEMS', newArray)
              })
          }
          return
        }

        cart = cartCookie.split('=')[1]
        cart = decodeURIComponent(cart)
      } else if (process.client) {
        cart = localStorage.getItem('cart')
      }

      vuexContext.commit('SET_CART_ITEMS', JSON.parse(cart))
    },

    liveStock ({ commit }, payload) {
      const category = payload.category
      const productId = payload.product_id
      return this.$axios.$get(`${process.env.BASE_URL}/categories/${category}/${productId}/stock.json`)
        .then((stock) => {
          return stock
        })
        .catch((err) => {
          throw err
        })
    }
  },

  getters: {
    cartItems (state) {
      return state.added
    },

    cartTotalItems (state) {
      if (state.added) {
        const total = state.added.reduce((a, b) => {
          return {
            quantity: a.quantity + b.quantity
          }
        }, { quantity: 0 })

        return total.quantity
      }
      return 0
    },

    cartSubtotal (state) {
      if (state.added) {
        return state.added.reduce((a, b) => {
          const isOnSale = b.on_sale

          function price () {
            if (isOnSale) {
              return b.sale_price
            }
            return b.price
          }
          return a + price() * b.quantity
        }, 0)
      }
      return 0
    }
  }
}

export default store
