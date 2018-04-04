import Cookies from 'js-cookie'
import { key } from 'firebase-key'
import { setAnonAuth, resetAnonAuth } from '~/utils/anonAuth'
import Vue from 'vue'
import _ from 'lodash'
import axios from 'axios'

const store = {
  namespaced: true,

  state: {
    cartItems: []
  },

  mutations: { 
    SET_CART_ITEMS (state, payload) {
      state.cartItems = payload
    },

    CLEAR_CART_ITEMS (state) {
      state.cartItems = []
    }
  },

  actions: {
    addToCart ({ dispatch, commit, rootGetters }, payload) {
      const isAuthenticated = rootGetters['auth/isAuthenticated']
      const isAnonAuthenticated = rootGetters['anonAuth/isAuthenticated']
      const vm = this
      let token
      let uid
      let userId
      let cartId
      let currentQuantity

      function cart (token, uid) {
        return vm.$axios.$get(`${process.env.BASE_URL}/users/${uid}/cart.json?auth=${token}`)
      }

      function productId (token, cartId, product) {
        console.log('cartId', cartId)
        const productId = product.product_id
        return vm.$axios.$get(`${process.env.BASE_URL}/cartSessions/${cartId}/products/${productId}.json?auth=${token}`)
      }

      function updateItemInCartSessions (token, cartId, item, existingQty) {
        const quantity = item.quantity += existingQty
        return vm.$axios.$patch(`${process.env.BASE_URL}/cartSessions/${cartId}/products/${item.product_id}.json?auth=${token}`, { quantity })
      }

      function addUidToCart (userId, cartId) {
        console.log('ADDUIDTOCART', userId, cartId)
        return vm.$axios.$patch(`${process.env.BASE_URL}/users/${userId}.json?auth=${token}`, { cart: cartId })
      }

      function addAnonDataToCartSession (token, cartId) {
        console.log('Add anon data', cartId)
        return vm.$axios.$patch(`${process.env.BASE_URL}/cartSessions/${cartId}.json?auth=${token}`, {
          last_updated: {
            '.sv': 'timestamp'
          },
          is_anon: true
        })
      }

      function addItemToCartSessions (token, cartId, item, isAnon) {
        return vm.$axios.$put(`${process.env.BASE_URL}/cartSessions/${cartId}/products/${item.product_id}.json?auth=${token}`, item)
      }

      // User isnt signed in ANON nor Officially 
      if (!isAuthenticated && !isAnonAuthenticated) {
        console.log('User isnt ANON nor official')
        // create ANON user
        return dispatch('anonAuth/signInUser', null, { root: true })
          .then((result) => {
            // Cart session has been created
            // Product id and quantity has been added to it
            token = result.idToken
            uid = result.localId
            console.log('Cart session has been created', token)
            return addAnonDataToCartSession(token, uid)
          })
          .then(() => {
            return addItemToCartSessions(token, uid, payload)
          })
          .catch((err) => {
            console.log(err.response.data.error)
            throw err
          })
      }

      // User is signed in ANON but not Officially
      // NOTE: Cart session has already been created
      if (isAnonAuthenticated) {
        // Need to add item to session
        // But does user already have the same product id in there
        console.log('User is Anonymous only')
        token = rootGetters['anonAuth/token']
        uid = rootGetters['anonAuth/uid']
        return productId(token, uid, payload)
          .then((sessionDetails) => {
            console.log('SESSION DETAILS', sessionDetails)
            if (!sessionDetails) {
              return addAnonDataToCartSession(token, uid)
                .then(() => {
                  console.log('New Product has been added to a new cart session')
                  return addItemToCartSessions(token, uid, payload,)
                })
            }
            // If so, update quantity only
            console.log('Quantity has been updated', sessionDetails)
            currentQuantity = sessionDetails.quantity
            return addAnonDataToCartSession(token, uid)
              .then(() => {
                return updateItemInCartSessions(token, uid, payload, currentQuantity)
              })
            
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

    deleteFromCart ({ rootGetters }, data) {
      const token = rootGetters['auth/token'] || rootGetters['anonAuth/token']

      return this.$axios.$delete(`${process.env.BASE_URL}/cartSessions/${data.session_id}/products/${data.item.product_id}.json?auth=${token}`)
    },

    updateCartItemQuantity ({ rootGetters }, data) {
      const token = rootGetters['auth/token'] || rootGetters['anonAuth/token']
      return this.$axios.$patch(`${process.env.BASE_URL}/cartSessions/${data.cart_id}/products/${data.product_id}.json?auth=${token}`, { quantity: data.quantity })
    },

    fetchCartData ({ commit, dispatch, rootGetters }, req) {
      const isAuthenticated = rootGetters['auth/isAuthenticated']
      const isAnonAuthenticated = rootGetters['anonAuth/isAuthenticated']
      const vm = this
      let token
      let uid
      let userId
      let cartId
      let promises
      let cart
      let productIdPromise

      function cartUidSession (token, cartId) {
        return vm.$axios.$get(`${process.env.BASE_URL}/cartSessions/${cartId}/products/.json?auth=${token}`)
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

      // User is ANON user
      if (isAnonAuthenticated) {

        // Init anon auth first
        console.log('Init anon auth first')
        return dispatch('anonAuth/initAuth', req, { root: true })
          .then(() => {
            console.log('User is an ANON user')
            // Get ANONUID and see if there is a CART SESSION
            token = rootGetters['anonAuth/token']
            uid = rootGetters['anonAuth/uid']
            console.log('Get ANONUID and see if there is a cart session')
            console.log('token', token)
            return cartUidSession(token, uid)
          })
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
          })
          .catch((err) => {
            console.log(err.data)
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
