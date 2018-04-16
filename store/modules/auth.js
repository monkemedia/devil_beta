import { setAuthToken, setAuthUid, setAuthUsername, setAuthRefreshToken, setAuthExpirationDate, resetAuth } from '~/utils/auth'
import Cookies from 'js-cookie'
import _ from 'lodash'

const store = {
  namespaced: true,

  state: {
    token: null,
    username: null,
    uid: null
  },

  mutations: {
    SET_TOKEN (state, token) {
      state.token = token
    },

    SET_USERNAME (state, username) {
      state.username = username
    },

    SET_UID (state, payload) {
      state.uid = payload
    },

    CLEAR_USERNAME (state) {
      state.username = null
    },

    CLEAR_TOKEN (state) {
      state.token = null
    },

    CLEAR_UID (state) {
      state.uid = null
    }
  },

  actions: {
    initAuth ({ commit, dispatch }, req) {
      const vm = this
      let token
      let expirationDate
      let username
      let uid
      let refreshToken

      function refreshTokenApi (refreshTok) {
        const authUrl = `https://securetoken.googleapis.com/v1/token?key=${process.env.FB_API_KEY}`
        return vm.$axios.$post(authUrl, {
          grant_type: 'refresh_token',
          refresh_token: refreshTok
        })
      }

      if (req) {
        if (!req.headers.cookie) {
          console.log('CLEAR')
          commit('CLEAR_TOKEN')
          commit('CLEAR_USERNAME')
          commit('CLEAR_UID')

          resetAuth()
          return
        }

        let tokenCookies = req.headers.cookie
          .split(';')
          .find(c => c.trim().startsWith('token='))

        let usernameCookies = req.headers.cookie
          .split(';')
          .find(c => c.trim().startsWith('username='))

        let uidCookies = req.headers.cookie
          .split(';')
          .find(c => c.trim().startsWith('uid='))

        let expirationDateCookies = req.headers.cookie
          .split(';')
          .find(c => c.trim().startsWith('expiration-date='))

        let refreshTokenCookies = req.headers.cookie
          .split(';')
          .find(c => c.trim().startsWith('refresh-token='))

        if (!tokenCookies) {
          return
        }

        token = tokenCookies.split('=')[1]
        username = usernameCookies.split('=')[1]
        uid = uidCookies.split('=')[1]
        refreshToken = refreshTokenCookies.split('=')[1]
        expirationDate = expirationDateCookies.split('=')[1]

        setAuthToken(token)
        setAuthUid(uid)
        setAuthUsername(username)
        setAuthRefreshToken(refreshToken)
        setAuthExpirationDate(expirationDate)

        commit('SET_UID', uid)
        commit('SET_USERNAME', username)

        if (new Date().getTime() >= expirationDate) {
          console.log('TOKEN HAS EXPIRED')
          return refreshTokenApi(refreshToken)
            .then((result) => {
              console.log('REFRESH_RESULT', result.id_token)
              const setExpirationDate = new Date().getTime() + parseInt(result.expires_in) * 1000

              commit('SET_TOKEN', result.id_token)

              setAuthToken(result.id_token)
              setAuthRefreshToken(result.refreshToken)
              setAuthExpirationDate(setExpirationDate)
            })
            .catch((err) => {
              console.log(err.response.data.error)
              throw err
            })
        } else {
          commit('SET_TOKEN', token)
        }
      } else if (process.client) {
        token = Cookies.get('token')
        expirationDate = Cookies.get('expiration-date')
        refreshToken = Cookies.get('refresh-token')
        username = Cookies.get('username')
        uid = Cookies.get('uid')
      }
    },

    validateUsername ({}, username) {
      return this.$axios.$get(`${process.env.FB_URL}/usernames.json`)
        .then((data) => {
          const filterUsernames = _.filter(data, (key) => {
            return key.username === username
          })

          if (filterUsernames.length) {
            const myError = {
              response: {
                data: {
                  error: {
                    code: 'failed',
                    message: 'This username already exists, please try again.'
                  }
                }
              }
            }

            throw myError
          }

          return {
            response: {
              data: {
                error: {
                  code: 'success',
                  message: 'This username is available'
                }
              }
            }
          }
        })
    },

    saveUsernameToDatabase ({ state }, usernameDetails) {
      const username = usernameDetails.username
      const token = state.token
      return this.$axios.$put(`${process.env.FB_URL}/usernames/${username}.json?auth=${token}`, usernameDetails)
    },

    saveUserDetailsToDatabase ({ state }, userDetails) {
      const userId = userDetails.userId
      const token = state.token
      return this.$axios.$patch(`${process.env.FB_URL}/users/${userId}.json?auth=${token}`, userDetails)
    },

    transferAnonCartToSignedInCart ({ getters, dispatch, rootGetters }) {
      const vm = this

      function anonCartSessions (token, cartId) {
        return vm.$axios.$get(`${process.env.FB_URL}/cartSessions/${cartId}/products.json?auth=${token}`)
      }

      function deleteAnonCartSessions (token, cartId) {
        return vm.$axios.$delete(`${process.env.FB_URL}/cartSessions/${cartId}.json?auth=${token}`)
      }

      function addUidToCart (userId, cartId) {
        return vm.$axios.$patch(`${process.env.FB_URL}/users/${userId}.json?auth=${token}`, { cart: cartId })
      }

      function doesCartSessionExistInUserProfile (userId, token) {
        return vm.$axios.$get(`${process.env.FB_URL}/users/${userId}/cart.json?&auth=${token}`)
      }

      function addItemToCartSessions (token, cartId, items) {
        return vm.$axios.$patch(`${process.env.FB_URL}/cartSessions/${cartId}/products.json?auth=${token}`, items)
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

      if (!token) {
        return
      }

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
          commit('SET_UID', result.localId)

          setAuthToken(result.idToken)
          setAuthUid(result.localId)
          setAuthUsername(result.displayName)
          setAuthRefreshToken(result.refreshToken)
          setAuthExpirationDate(setExpirationDate)

          Cookies.set('token', result.idToken)
          Cookies.set('expiration-date', setExpirationDate)
          Cookies.set('username', result.displayName)
          Cookies.set('refresh-token', result.refreshToken)
          Cookies.set('uid', result.localId)

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

    registerUser ({ commit, dispatch, getters, rootGetters }, authData) {
      const authUrl = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${process.env.FB_API_KEY}`
      let response

      console.log(authData)

      return dispatch('validateUsername', authData.username)
        .then(() => {
          return this.$axios.$post(authUrl, {
            email: authData.email,
            password: authData.password,
            displayName: authData.username,
            returnSecureToken: true
          })
        })
        .then((result) => {
          response = result
          const setExpirationDate = new Date().getTime() + parseInt(result.expiresIn) * 1000

          commit('SET_TOKEN', result.idToken)
          commit('SET_USERNAME', result.displayName)
          commit('SET_UID', result.localId)

          setAuthToken(result.idToken)
          setAuthUid(result.localId)
          setAuthUsername(result.displayName)
          setAuthRefreshToken(result.idToken)
          setAuthExpirationDate(setExpirationDate)

          Cookies.set('token', result.idToken)
          Cookies.set('expiration-date', setExpirationDate)
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
        .then((data) => {
          const usernameDetails = {
            username: authData.username,
            userId: getters['userId']
          }

          return dispatch('saveUsernameToDatabase', usernameDetails)
        })
        .then(() => {
          const userDetails = {
            email: authData.email,
            username: authData.username,
            accountType: authData.accountType,
            userId: getters['userId'],
            cartIds: null
          }

          return dispatch('saveUserDetailsToDatabase', userDetails)
        })
        .then(() => {
          return response
        })
        .catch((err) => {
          console.log('ERROR', err)
          throw err.response.data.error
        })
    },

    logout ({ commit, rootState, rootGetters }) {
      console.log('LOGGED OUT')
      commit('CLEAR_TOKEN')
      commit('CLEAR_USERNAME')
      commit('CLEAR_UID')
      commit('cart/CLEAR_CART_ITEMS', null, { root: true })

      Cookies.remove('token')
      Cookies.remove('uid')
      Cookies.remove('username')
      Cookies.remove('refresh-token')
      Cookies.remove('expiration-date')

      resetAuth()
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
      return state.uid
    }
  }
}

export default store
