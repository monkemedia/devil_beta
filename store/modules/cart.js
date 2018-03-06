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
        quantity: 1
      })
    },

    INCREMENT_ITEM_QUANTITY (state, product) {
      const cartItem = state.added.find(item => item.product_id === product.cartItem.product_id)
      cartItem.quantity += product.quantity
    },

    SET_CART_ITEMS (state, items) {
      console.log('HERE', items)
      state.added = items
    }
  },

  actions: {
    addToCart ({ state, dispatch, commit }, product) {
      const cartItem = state.added.find(item => item.product_id === product.product_id)
      if (!cartItem) {
        commit('PUSH_PRODUCT_TO_CART', product)
        localStorage.setItem('cart', JSON.stringify(state.added))
        Cookies.set('cart', state.added)
      } else {
        const payload = {
          cartItem,
          quantity: product.quantity
        }
        commit('INCREMENT_ITEM_QUANTITY', payload)
        localStorage.setItem('cart', JSON.stringify(state.added))
        Cookies.set('cart', state.added)
      }
    },

    initCart (vuexContext, req) {
      let cart

      if (req) {
        if (!req.headers.cookie) {
          return
        }

        let cartCookie = req.headers.cookie
          .split(';')
          .find(c => c.trim().startsWith('cart='))
        
        if (!cartCookie) {
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

    cartTotalItems: (state) => {
      const total = state.added.reduce((a, b) => {
        return {
          quantity: a.quantity + b.quantity
        }
      }, { quantity: 0 })

      return total.quantity
    },

    cartSubtotal: (state) => {
      // return state.cartItems.reduce((a, b) => {
      //   const isOnSale = b.item.on_sale

      //   function price () {
      //     if (isOnSale) {
      //       return b.item.sale_price
      //     }
      //     return b.item.price
      //   }
      //   return a + price() * b.quantity
      // }, 0)
    }
  }
}

export default store

// import Cookie from 'js-cookie'
// import _ from 'lodash'

// const store = {
//   namespaced: true,

//   state: {
//     cartItems: []
//   },

//   mutations: {
//     SET_CART_PUSH (state, payload) {
//       state.cartItems.push(payload)
//     },

//     SET_CART (state, payload) {
//       console.log('payload', payload)
//       state.cartItems = payload
//     },

//     CLEAR_CART (state) {
//       state.cartItems = null
//     },
//   },

//   actions: {
//     addToCart ({ state, commit, rootGetters }, cartData) {
//       let itemArray
//       let cookieCart = JSON.parse(localStorage.getItem('cart'))
//       const vm = this
//       const record = state.cartItems.find(element => element.item.product_id === cartData.item.product_id)
//       const isAuthenticated = rootGetters['auth/isAuthenticated']

//       function addItemToCartServer (item) {
//         console.log('here', item)
//         return new Promise((resolve, reject) => {
//           const userId = rootGetters['auth/userId']
//           const token = rootGetters['auth/token']
//           const productId = item.item.product_id
//           return vm.$axios.$put(`${process.env.BASE_URL}/usersCart/${userId}/${productId}.json?auth=${token}`, item)
//             .then((result) => {
//               console.log('result', result)
//               resolve(result)
//             })
//             .catch((err) => {
//               console.log('error', err)
//               reject(err)
//             })
//         })
//       }

//       function updateItemToCartServer (productId, quantity) {
//         console.log('productId', productId)
//         console.log('quantity', quantity)
//         return new Promise((resolve, reject) => {
//           const userId = rootGetters['auth/userId']
//           const token = rootGetters['auth/token']
//           return vm.$axios.$patch(`${process.env.BASE_URL}/usersCart/${userId}/${productId}.json?auth=${token}`, { quantity })
//             .then((result) => {
//               console.log('result', result)
//               resolve(result)
//             })
//             .catch((err) => {
//               console.log('error', err)
//               reject(err)
//             })
//         })
//       }

//       function updateItem (cartData) {
//         let quantity
//         if (cookieCart) {
//           cookieCart.map((element) => {
//             if (element.item.product_id === cartData.item.product_id) {
//               element.quantity += cartData.quantity
//               quantity = element.quantity
//             }
//             return element
//           })
//         } else {
//           cookieCart = cartData
//         }
        

//         localStorage.setItem('cart', JSON.stringify(cookieCart))
//         state.cartItems = cookieCart
//         Cookie.set('cart', cookieCart)
//         commit('SET_CART', cookieCart)
//         if (isAuthenticated) { 
//           updateItemToCartServer(cartData.item.product_id, quantity)
//         }
//       }

//       function addItem (item) {
//         if (cookieCart) {
//           cookieCart.push(item)
//           localStorage.setItem('cart', JSON.stringify(cookieCart))
//           Cookie.set('cart', cookieCart)
//         } else {
//           itemArray = []
//           itemArray.push(item)
//           localStorage.setItem('cart', JSON.stringify(itemArray))
//           Cookie.set('cart', itemArray)
//         }
//         commit('SET_CART_PUSH', item)
//         if (isAuthenticated) {
//           addItemToCartServer(item)
//         }
//       }

//       if (record) { // Product is already in cart so just change quantity
//         updateItem(cartData)
//       } else {
//         const data = {
//           ...cartData,
//           quantity: cartData.quantity
//         }
//         addItem(data)
//       }
//     },

//     initCart (vuexContext, req) {
//       let cart
//       let cartCleaned
//       const isAuthenticated = vuexContext.rootGetters['auth/isAuthenticated']
//       const userId = vuexContext.rootGetters['auth/userId']
//       const token = vuexContext.rootGetters['auth/token']

//       if (req) {
//         if (!req.headers.cookie) {
//           return
//         }

//         let cartCookie = req.headers.cookie
//           .split(';')
//           .find(c => c.trim().startsWith('cart='))
        
//         if (!cartCookie) {
//           if (isAuthenticated) {
//             console.log('POO')
//             this.$axios.$get(`${process.env.BASE_URL}/usersCart/${userId}.json?auth=${token}`)
//               .then((result) => {
//                 console.log('RESULT', result)
//                 const itemArray = []
//                 Object.keys(result).map((value, index) => {
//                   itemArray.push(result[value])
//                 })
//                 console.log('itemArray', itemArray)
//                 // localStorage.setItem('cart', JSON.stringify(itemArray))
//                 // Cookie.set('cart', itemArray)
//                 vuexContext.commit('SET_CART', itemArray)
//               })
//             return
//           }
//           return
//         }
//         cart = cartCookie.split('=')[1]
//         cartCleaned = decodeURIComponent(cart)
//         vuexContext.commit('SET_CART', JSON.parse(cartCleaned))
//       } else if (process.client) {
//         cart = localStorage.getItem('cart')
//         vuexContext.commit('SET_CART', JSON.parse(cart))
//       }
//     },

//     liveStock ({ commit }, payload) {
//       const category = payload.category
//       const productId = payload.product_id
//       return this.$axios.$get(`${process.env.BASE_URL}/categories/${category}/${productId}/stock.json`)
//         .then((stock) => {
//           return stock
//         })
//         .catch((err) => {
//           throw err
//         })
//     }
//   },

//   getters: {
//     cartItems (state) {
//       return state.cartItems
//     },

//     cartTotalItems: (state) => {
//       const total = state.cartItems.reduce((a, b) => {
//         return {
//           quantity: a.quantity + b.quantity
//         }
//       }, { quantity: 0 })

//       return total.quantity
//     },

//     cartSubtotal: (state) => {
//       return state.cartItems.reduce((a, b) => {
//         const isOnSale = b.item.on_sale

//         function price () {
//           if (isOnSale) {
//             return b.item.sale_price
//           }
//           return b.item.price
//         }
//         return a + price() * b.quantity
//       }, 0)
//     }
//   }
// }

// export default store