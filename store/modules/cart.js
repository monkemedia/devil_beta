import Cookie from 'js-cookie'
import { key } from 'firebase-key'
import Vue from 'vue'
import _ from 'lodash'
import axios from 'axios'

const store = {
  namespaced: true,

  state: {
    cartItems: [],
    anonToken: null,
    anonUid: null
  },

  mutations: { 
    SET_CART_ITEMS (state, payload) {
      console.log('SET_CART_ITEMS', payload)
      // state.cartItems.push(payload)
      // Vue.set(state.cartItems, payload.index, payload)
      // Vue.set(state.cartItems, payload)
      state.cartItems = payload
    },

    SET_ANON_TOKEN (state, payload) {
      state.anonToken = payload
    },

    SET_ANON_UID (state, payload) {
      state.anonUid = payload
    },

    CLEAR_CART_ITEMS (state) {
      state.cartItems = []
    },

    CLEAR_ANON_TOKEN (state) {
      state.anonToken = null
    },

    CLEAR_ANON_UID (state) {
      state.anonUid = null
    }
  },

  actions: {
    initCart ({ commit }, req) {
      let token
      let uid

      if (req) {
        if (!req.headers.cookie) {
          commit('CLEAR_ANON_TOKEN')
          commit('CLEAR_ANON_UID')
          return
        }

        let tokenCookie = req.headers.cookie
          .split(';')
          .find(c => c.trim().startsWith('anonToken='))

        let uidCookie = req.headers.cookie
          .split(';')
          .find(c => c.trim().startsWith('anonUid='))
        
        if (!tokenCookie) {
          return
        }

        token = tokenCookie.split('=')[1]
        uid = uidCookie.split('=')[1]
      } else if (process.client) {
        token = localStorage.getItem('anonToken')
        uid = localStorage.getItem('anonUid')
      }

      commit('SET_ANON_TOKEN', token)
      commit('SET_ANON_UID', uid)
    },

    addToCart ({ dispatch, commit, getters, rootGetters }, payload) {
      const isAuthenticated = rootGetters['auth/isAuthenticated']
      const isAnonAuthenticated = getters['isAnonAuthenticated']
      const vm = this
      let token
      let uid
      let userId
      let cartId
      let currentQuantity

      function signInUserAnonymously () {
        const authUrl = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${process.env.FB_API_KEY}`

        console.log('KEY', process.env.FB_API_KEY)

        return vm.$axios.$post(authUrl, {
          returnSecureToken: true
        })
          .then((result) => {
            commit('SET_ANON_TOKEN', result.idToken)
            commit('SET_ANON_UID', result.localId)

            localStorage.setItem('anonToken', result.idToken)
            localStorage.setItem('anonUid', result.localId)

            Cookie.set('anonToken', result.idToken)
            Cookie.set('anonUid', result.localId)
            return result
          })
      }

      function cart (token, uid) {
        return vm.$axios.$get(`${process.env.BASE_URL}/users/${uid}/cart.json?auth=${token}`)
      }

      function productId (token, cartId, product) {
        const productId = product.product_id
        return vm.$axios.$get(`${process.env.BASE_URL}/cartSessions/${cartId}/${productId}.json?auth=${token}`)
      }

      function updateItemInCartSessions (token, cartId, item, existingQty) {
        const quantity = item.quantity += existingQty
        return vm.$axios.$patch(`${process.env.BASE_URL}/cartSessions/${cartId}/${item.product_id}.json?auth=${token}`, { quantity })
      }

      function addUidToCart (userId, cartId) {
        console.log('ADDUIDTOCART', userId, cartId)
        return vm.$axios.$patch(`${process.env.BASE_URL}/users/${userId}.json?auth=${token}`, { cart: cartId })
      }

      function addItemToCartSessions (token, cartId, item) {
        return vm.$axios.$put(`${process.env.BASE_URL}/cartSessions/${cartId}/${item.product_id}.json?auth=${token}`, item)
      }

      // User isnt signed in ANON nor Officially 
      if (!isAuthenticated && !isAnonAuthenticated) {
        console.log('User isnt ANON nor official')
        // create ANON user
        return signInUserAnonymously()
          .then(() => {
            // Cart session has been created
            // Product id and quantity has been added to it
            token = getters['anonToken']
            uid = getters['anonUid']
            console.log('Cart session has been created')
            return addItemToCartSessions(token, uid, payload)
          })
          .catch((err) => {
            throw err
          })
      }

      // User is signed in ANON but not Officially
      // NOTE: Cart session has already been created
      if (isAnonAuthenticated) {
        // Need to add item to session
        // But does user already have the same product id in there
        console.log('User is Anonymous only')
        token = getters['anonToken']
        uid = getters['anonUid']
        return productId(token, uid, payload)
          .then((sessionDetails) => {
            console.log('SESSION DETAILS', sessionDetails)
            if (!sessionDetails) {
              // If not, add the product to a new cart session
              console.log('New Product has been added to a new cart session')
              return addItemToCartSessions(token, uid, payload)
                // .then(() => {
                //   commit('SET_CART_ITEMS', payload)
                //   return
                // })
            }
            // If so, update quantity only
            console.log('Quantity has been updated', sessionDetails)
            currentQuantity = sessionDetails.quantity
            return updateItemInCartSessions(token, uid, payload, currentQuantity)
          })
          .then(() => {
            // Fetch data from database and commit to state
            return dispatch('fetchCartData')

          })
          .catch((err) => {
            throw err
          })
      }

      // User is Officially signed in
      if (isAuthenticated) {
        // let newUid
        console.log('User is Official')
        token = rootGetters['auth/token']
        uid = rootGetters['auth/userId']

        // Does the user have a cart stored in their profile
        console.log('Does the user have a cart session stored in their profile')
        
        return cart(token, uid)
          .then((cartSessionId) => {
            console.log('CART', cartSessionId)
            if (!cartSessionId) {
              // If not, create a new cart session
              console.log('Official user does not have a cart session in their profile so generate new session')
              const newCartSessionId = key()
              const item = payload
              return addUidToCart(uid, newCartSessionId)
                .then(() => {
                  // Now add details to Cart Sessions
                  return addItemToCartSessions(token, newCartSessionId, item)
                })
            }

            // There is a cart session so get the cartId
            // User has a cart session, so lets see if the product_id already exists
            console.log('Official user has a cart session', cartSessionId)
            return productId(token, cartSessionId, payload)
              .then((sessionDetails) => {
                console.log('PRODUCT sessionDetails', sessionDetails)
                if (!sessionDetails) {
                  // If it doesnt, add the new product_id to the current cart session
                  console.log('Official user - Product ID does NOT exist, so add it to current cart session')
                  return addItemToCartSessions(token, cartSessionId, payload)
                }
                // If it does exist, just update quantity
                currentQuantity = sessionDetails.quantity
                console.log('Official user - Product ID does exist, so update quantity only')
                return updateItemInCartSessions(token, cartSessionId, payload, currentQuantity)
              })
          })
          .catch((err) => {
            console.log('ERROR', err)
            throw err
          })
      }
    },

    deleteFromCart ({ getters, rootGetters }, data) {
      console.log('DATA', data)
      const token = rootGetters['auth/token'] || getters['anonToken']

      return this.$axios.$delete(`${process.env.BASE_URL}/cartSessions/${data.session_id}/${data.item.product_id}.json?auth=${token}`)
    },

    fetchCartData ({ commit, getters, rootGetters }) {
      const isAuthenticated = rootGetters['auth/isAuthenticated']
      const isAnonAuthenticated = getters['isAnonAuthenticated']
      const vm = this
      let token
      let uid
      let userId
      let cartId
      let promises
      let cart
      let productIdPromise

      function cartUidSession (token, cartId) {
        return vm.$axios.$get(`${process.env.BASE_URL}/cartSessions/${cartId}.json?auth=${token}`)
          .then((sessionData) => {
            return {
              session_data: sessionData,
              cart_id: cartId
            }
          })
      }

      function getCartId (token, userId) {
        return vm.$axios.$get(`${process.env.BASE_URL}/users/${userId}/cart.json?auth=${token}`)
      }

      function getProductData (sessionData) {
        promises = []
        cart = []

        _.filter(sessionData.session_data, (key) => {
          promises.push(axios.get(`${process.env.BASE_URL}/products/${key.product_id}.json`)
            .then((res) => {
              return {
                item: res.data,
                quantity: key.quantity,
                session_id: sessionData.cart_id
              }
            }))
        })

        // Add product data and quantity to cart items in state
        return axios.all(promises)
          .then((result) => {
            return result
          })
          .catch((err) => {
            console.log(err)
            throw err
          })
      }

      //User isnt ANON nor official user, so dont do anything
      if (!isAuthenticated && !isAnonAuthenticated) {
        console.log('User isnt ANON nor official user so clear cart items')
        commit('CLEAR_CART_ITEMS')
      }

      // User is ANON user
      if (isAnonAuthenticated) {
      
        console.log('User is an ANON user')
        // Get ANONUID and see if there is a CART SESSION
        token = getters['anonToken']
        uid = getters['anonUid']
        console.log('Get ANONUID and see if there is a cart session')
        console.log('uid', uid)
        console.log('token', token)
        return cartUidSession(token, uid)
          .then((sessionData) => {
            if (!sessionData) {
              // If there isnt a session lets just stop here
              console.log('If there isnt a session lets just stop here')
              return
            }

            // There is a cart session, so lets get all the product ID'S
            console.log('There is a cart session, so lets get all the product IDs', sessionData)
            // Loop through Product IDs and get product data for each product ID
            return getProductData(sessionData)
          })
          .then((result) => {
            commit('SET_CART_ITEMS', result || [])
            console.log('MONKEY', result)
          })
          .catch((err) => {
            throw err
          })
      }

      // User is Officially signed in
      if (isAuthenticated) {
        console.log('User is Officially signed in')
        token = rootGetters['auth/token']
        userId = rootGetters['auth/userId']

        return getCartId(token, userId)
          .then((sessionId) => {
            if (!sessionId) {
              // If there isnt a session lets just stop here
              console.log('If there isnt any CartIDs lets just stop here')
              return
            }

            // There are cart sessions, so lets get all the cart IDs
            console.log('There are cart sessions, so lets get all the cart IDs', sessionId)
            // There are cart sessions, so lets get all the cart IDs
            return cartUidSession(token, sessionId)
          })
          .then((sessionData) => {
            return getProductData(sessionData)
          })
          .then((result) => {
            commit('SET_CART_ITEMS', result)
          })
          .catch((err) => {
            console.log(err)
            throw err
          })
      }
    },

    liveStock ({ commit }, payload) {
      const category = payload.category
      const productId = payload.product_id

      return this.$axios.$get(`${process.env.BASE_URL}/categories/${category}/${productId}/stock.json`)
        .then((stock) => {
          console.log('livestock', 5)
          return stock
        })
        .catch((err) => {
          throw err
        })
    }
  },

  getters: {
    isAnonAuthenticated (state) {
      return !!state.anonToken
    },

    anonToken (state) {
      return state.anonToken
    },

    anonUid (state) {
      return state.anonUid
    },

    loadedCartItems (state) {
      return state.cartItems
    },

    cartTotalItems (state) {
      if (state.cartItems) {
        const total = state.cartItems.reduce((a, b) => {
          return {
            quantity: a.quantity + b.quantity
          }
        }, { quantity: 0 })

        return total.quantity
      }
      return 0
    },

    cartSubtotal (state) {
      if (state.cartItems) {
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
      return 0
    }
  }
}

export default store

// import Cookies from 'js-cookie'

// const store = {
//   namespaced: true,

//   state: {
//     added: []
//   },

//   mutations: {
//     PUSH_PRODUCT_TO_CART (state, product) {
//       state.added.push({
//         product_id: product.product_id,
//         price: product.price,
//         on_sale: product.on_sale,
//         sale_price: product.sale_price,
//         quantity: 1
//       })
//     },

//     INCREMENT_ITEM_QUANTITY (state, product) {
//       const cartItem = state.added.find(item => item.product_id === product.product_id)
//       cartItem.quantity += product.quantity
//     },

//     SET_CART_ITEMS (state, items) {
//       state.added = items
//     }
//   },

//   actions: {
//     addToDatabase ({ rootGetters }, payload) {
//       const token = rootGetters['auth/token']
//       const userId = rootGetters['auth/userId']
//       const productId = payload.product_id

//       return this.$axios.$put(`${process.env.BASE_URL}/cart/${userId}/${productId}.json?auth=${token}`, payload)
//         .then((result) => {
//           return result
//         })
//         .catch((err) => {
//           throw err
//         })
//     },

//     updateDatabase ({ state, rootGetters }, payload) {
//       const token = rootGetters['auth/token']
//       const userId = rootGetters['auth/userId']

//       return this.$axios.$get(`${process.env.BASE_URL}/cart/${userId}/${payload.product_id}.json?auth=${token}`)
//         .then((result) => {
//           if (result) {
//             result.quantity += payload.quantity
//             return this.$axios.$patch(`${process.env.BASE_URL}/cart/${userId}/${payload.product_id}.json?auth=${token}`, { quantity: result.quantity })
//           }
//         })
//         .then((result) => {
//           return result
//         })
//         .catch((err) => {
//           throw err
//         })
//     },

//     addToCart ({ state, dispatch, commit, rootGetters }, product) {
//       const cartItem = state.added.find(item => item.product_id === product.product_id)
//       const isAuthenticated = rootGetters['auth/isAuthenticated']

//       function saveMethod (location, product) {
//         commit(location, product)
//         localStorage.setItem('cart', JSON.stringify(state.added))
//         Cookies.set('cart', state.added)
//       }

//       if (!cartItem) {
//         if (isAuthenticated) {
//           saveMethod('PUSH_PRODUCT_TO_CART', product)
//           return dispatch('addToDatabase', product)
//             .then((result) => {
//               return result
//             })
//             .catch((err) => {
//               throw err
//             })
//         }

//         saveMethod('PUSH_PRODUCT_TO_CART', product)
//       } else {
//         const payload = {
//           cartItem,
//           quantity: product.quantity
//         }

//         if (isAuthenticated) {
//           saveMethod('INCREMENT_ITEM_QUANTITY', product)
//           return dispatch('updateDatabase', product) // HERE
//             .then((result) => {
//               console.log('result', product)
//               return result
//             })
//             .catch((err) => {
//               console.log('ERROR', err)
//               throw err
//             })
//         }

//         saveMethod('INCREMENT_ITEM_QUANTITY', product)
//       }
//     },

//     initCart (vuexContext, req) {
//       const isAuthenticated = vuexContext.rootGetters['auth/isAuthenticated']
//       let token
//       let userId
//       let cart

//       if (req) {
//         if (!req.headers.cookie) {
//           return
//         }

//         let cartCookie = req.headers.cookie
//           .split(';')
//           .find(c => c.trim().startsWith('cart='))
        
//         if (!cartCookie) {
//           // if there is no cart cookie, then lets see if user has cart saved on database
//           if (isAuthenticated) {
//             token = vuexContext.rootGetters['auth/token']
//             userId = vuexContext.rootGetters['auth/userId']
//             this.$axios.$get(`${process.env.BASE_URL}/cart/${userId}.json?auth=${token}`)
//               .then((result) => {
//                 console.log('user has cart on db' )
//                 const newArray = []
//                 Object.keys(result).forEach((item) => {
//                   newArray.push(result[item])
//                 })
//                 vuexContext.commit('SET_CART_ITEMS', newArray)
//               })
//           }
//           return
//         }

//         cart = cartCookie.split('=')[1]
//         cart = decodeURIComponent(cart)
//       } else if (process.client) {
//         cart = localStorage.getItem('cart')
//       }

//       vuexContext.commit('SET_CART_ITEMS', JSON.parse(cart))
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
//       return state.added
//     },

//     cartTotalItems (state) {
//       if (state.added) {
//         const total = state.added.reduce((a, b) => {
//           return {
//             quantity: a.quantity + b.quantity
//           }
//         }, { quantity: 0 })

//         return total.quantity
//       }
//       return 0
//     },

//     cartSubtotal (state) {
//       if (state.added) {
//         return state.added.reduce((a, b) => {
//           const isOnSale = b.on_sale

//           function price () {
//             if (isOnSale) {
//               return b.sale_price
//             }
//             return b.price
//           }
//           return a + price() * b.quantity
//         }, 0)
//       }
//       return 0
//     }
//   }
// }

// export default store
