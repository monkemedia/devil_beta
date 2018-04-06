import Cookies from 'js-cookie'
import _ from 'lodash'

const store = {
  namespaced: true,

  state: {
    token: null,
    username: null,
    userId: null
  },

  mutations: {
    SET_TOKEN (state, token) {
      state.token = token
    },

    SET_USERNAME (state, username) {
      state.username = username
    },

    SET_USERID (state, userId) {
      state.userId = userId
    },

    CLEAR_USERNAME (state) {
      state.username = null
    },

    CLEAR_TOKEN (state) {
      state.token = null
    },

    CLEAR_USERID (state) {
      state.userId = null
    }
  },

  actions: {
    validateUsername ({}, username) {
      return this.$axios.$get(`${process.env.BASE_URL}/usernames.json`)
        .then(data => {
          const filterUsernames = _.filter(data, (key) => {
            return key.username === username
          })

          if (filterUsernames.length) {
            throw {
              code: 'failed',
              message: 'This username already exists, please try again.'
            }
          }

          return {
            code: 'success',
            message: 'This username is available'
          }
        })
    },

    saveUsernameToDatabase ({ state }, usernameDetails) {
      const username = usernameDetails.username
      const token = state.token
      return this.$axios.$put(`${process.env.BASE_URL}/usernames/${username}.json?auth=${token}`, usernameDetails)
    },

    saveUserDetailsToDatabase ({ state }, userDetails) {
      const userId = userDetails.userId
      const token = state.token
      return this.$axios.$patch(`${process.env.BASE_URL}/users/${userId}.json?auth=${token}`, userDetails)
    },

    transferAnonCartToSignedInCart ({ getters, dispatch, rootGetters }) {
      const vm = this

      function anonCartSessions (token, cartId) {
        return vm.$axios.$get(`${process.env.BASE_URL}/cartSessions/${cartId}/products.json?auth=${token}`)
      }

      function deleteAnonCartSessions (token, cartId) {
        return vm.$axios.$delete(`${process.env.BASE_URL}/cartSessions/${cartId}.json?auth=${token}`)
      }

      function addUidToCart (userId, cartId) {
        return vm.$axios.$patch(`${process.env.BASE_URL}/users/${userId}.json?auth=${token}`, { cart: cartId })
      }

      function doesCartSessionExistInUserProfile (userId, token) {
        return vm.$axios.$get(`${process.env.BASE_URL}/users/${userId}/cart.json?&auth=${token}`)
      }

      function addItemToCartSessions (token, cartId, items) {
        return vm.$axios.$patch(`${process.env.BASE_URL}/cartSessions/${cartId}/products.json?auth=${token}`, items)
      }
      // Add anon cart uid to userprofile
      const isAnonAuthenticated = rootGetters['anonAuth/isAuthenticated']
      let userId
      let token
      let cartId

      // When the user signs in Officially, let's see it they have a ANON token
      console.log('User has signed in officially, lets see if they a ANON token')
      if (isAnonAuthenticated) {
        userId = getters['userId']
        token = getters['token']
        cartId = rootGetters['anonAuth/uid']
        // User has ANON token, let's see if they have a cart session
        console.log('User has signed in officially, and they do have a anon token')
        return doesCartSessionExistInUserProfile(userId, token)
          .then((sessionId) => {
            console.log('sessionId PEOPLE', sessionId)
            if (!sessionId) {
              console.log('Officially signed in user does not have a sessionCart Id ib user profile')
              console.log('So add ANON cart session ID to user profile')
              return addUidToCart(userId, cartId)
                .then(() => {
                  // Log out ANON user
                  console.log('LOGOUT OUT ANON USER')
                  return dispatch('anonAuth/logoutUser', null, { root: true })
                })
            }

            // User has cart session ID so add anon session products to it
            console.log('User has cart session ID so get anon session details then add it to offical cartSessions')
            token = rootGetters['anonAuth/token']
            return anonCartSessions(token, cartId)
              .then((items) => {
                token = getters['token']
                return addItemToCartSessions(token, sessionId, items)
              })
              .then(() => {
                // Remove ANON cart session
                token = rootGetters['anonAuth/token']
                return deleteAnonCartSessions(token, cartId)
              })
          })
      }
      // User doesnt have a ANON token so they don't have cart data saved anonymously, so don't do anything
      console.log('User doesnt have a ANON token so they dont have cart data saved anonymously, so dont do anything')
    },

    deleteUser ({}, token) {
      const authUrl = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/deleteAccount?key=${process.env.FB_API_KEY}`

      return this.$axios.$post(authUrl, {
        idToken: token
      })
    },

    loginUser ({ commit, getters, dispatch, rootState, rootGetters }, authData) {
      const authUrl = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${process.env.FB_API_KEY}`

      return this.$axios.$post(authUrl, {
        email: authData.email,
        password: authData.password,
        returnSecureToken: true
      })
        .then((result) => {
          const setExpirationDate = new Date().getTime() + parseInt(result.expiresIn) * 1000

          console.log('RESULT', result)

          commit('SET_TOKEN', result.idToken)
          commit('SET_USERNAME', result.displayName)
          commit('SET_USERID', result.localId)

          localStorage.setItem('token', result.idToken)
          localStorage.setItem('tokenExpiration', setExpirationDate)
          localStorage.setItem('username', result.displayName)
          localStorage.setItem('userId', result.localId)

          Cookies.set('jwt', result.idToken)
          Cookies.set('expirationDate', setExpirationDate)
          Cookies.set('username', result.displayName)
          Cookies.set('userId', result.localId)

          return result
        })
        .then(() => {
          return dispatch('transferAnonCartToSignedInCart')
        })
        .then(() => {
          // Delete anon user
          console.log('DELETE ANON USER')
          const token = rootGetters['anonAuth/token']
          if (!token) {
            return
          }
          return dispatch('deleteUser', token)
        })
        .then(() => {
          // then Log out ANON user
          const token = rootGetters['anonAuth/token']
          console.log('LOGOUT OUT ANON USER')
          if (!token) {
            return
          }
          return dispatch('anonAuth/logoutUser', null, { root: true })
        })
        .catch((err) => {
          console.log(err)
          throw err.response.data.error
        })
    },

    registerUser ({ commit, dispatch, rootGetters }, authData) {
      const authUrl = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${process.env.FB_API_KEY}`
      let response

      return this.$axios.$post(authUrl, {
        email: authData.email,
        password: authData.password,
        displayName: authData.username,
        returnSecureToken: true
      })
        .then((result) => {
          console.log('RESULT', result)
          response = result
          const setExpirationDate = new Date().getTime() + parseInt(result.expiresIn) * 1000

          commit('SET_TOKEN', result.idToken)
          commit('SET_USERNAME', result.displayName)
          commit('SET_USERID', result.localId)

          localStorage.setItem('token', result.idToken)
          localStorage.setItem('tokenExpiration', setExpirationDate)
          localStorage.setItem('username', result.displayName)
          localStorage.setItem('userId', result.localId)

          Cookies.set('jwt', result.idToken)
          Cookies.set('expirationDate', setExpirationDate)
          Cookies.set('username', result.displayName)
          Cookies.set('userId', result.localId)

          return { result }
        })
        .then(() => {
          return dispatch('transferAnonCartToSignedInCart')
        })
        .then(() => {
          // Delete anon user
          const token = rootGetters['cart/anonToken']
          return dispatch('deleteUser', token)
        })
        .then(() => {
          // then Log out ANON user
          console.log('LOGOUT OUT ANON USER')
          return dispatch('anonAuth/logoutUser', null, { root: true })
        })
        .then(() => {
          return response
        })
        .catch((err) => {
          console.log('ERROR', err)
          throw err.response.data.error
        })
    },

    initAuth ({ commit, dispatch }, req) {
      let token
      let expirationDate
      let username
      let userId

      if (req) {
        if (!req.headers.cookie) {
          console.log('CLEAR')
          commit('CLEAR_TOKEN')
          commit('CLEAR_USERNAME')
          commit('CLEAR_USERID')

          dispatch('logout')
          return
        }

        let jwtCookies = req.headers.cookie
          .split(';')
          .find(c => c.trim().startsWith('jwt='))

        let usernameCookies = req.headers.cookie
          .split(';')
          .find(c => c.trim().startsWith('username='))

        let userIdCookies = req.headers.cookie
          .split(';')
          .find(c => c.trim().startsWith('userId='))

        if (!jwtCookies) {
          return
        }

        token = jwtCookies.split('=')[1]
        expirationDate = req.headers.cookie
          .split(';')
          .find(c => c.trim().startsWith('expirationDate='))
          .split('=')[1]
        username = usernameCookies.split('=')[1]
        userId = userIdCookies.split('=')[1]
      } else if (process.client) {
        token = localStorage.getItem('token')
        expirationDate = localStorage.getItem('tokenExpiration')
        username = localStorage.getItem('username')
        userId = localStorage.getItem('userId')
      }

      console.log('TOKEN', token)

      if (new Date().getTime() > parseInt(expirationDate) || !token) {
        console.log('no token or invalid token')
        dispatch('logout')
        return
      }

      commit('SET_TOKEN', token)
      commit('SET_USERNAME', username)
      commit('SET_USERID', userId)
    },

    logout ({ commit, rootState, rootGetters }) {
      console.log('LOGGED OUT')
      commit('CLEAR_TOKEN')
      commit('CLEAR_USERNAME')
      commit('CLEAR_USERID')
      commit('cart/CLEAR_CART_ITEMS', null, { root: true })

      Cookies.remove('jwt')
      Cookies.remove('expirationDate')
      Cookies.remove('username')
      Cookies.remove('userId')

      if (process.client) {
        localStorage.removeItem('token')
        localStorage.removeItem('tokenExpiration')
        localStorage.removeItem('username')
        localStorage.removeItem('userId')
      }

      // if (rootGetters['cart/isAnonAuthenticated']) {
      //   rootState['cart/CLEAR_ANON_TOKEN'] = null
      //   rootState['cart/CLEAR_ANON_UID'] = null
      //   Cookies.remove('anonToken')
      //   Cookies.remove('anonUid')
      //   Cookies.remove('anonTokenExpiration')

      //   if (process.client) {
      //     localStorage.removeItem('anonToken')
      //     localStorage.removeItem('anonUid')
      //     localStorage.removeItem('anonTokenExpiration')
      //   }
      // }
    }
  },

  getters: {
    isAuthenticated (state) {
      return !!state.token
    },

    token (state) {
      return state.token
    },

    username (state) {
      return state.username
    },

    userId (state) {
      return state.userId
    }
  }
}

export default store
