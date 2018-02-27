import Cookie from 'js-cookie'
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
    validateUsername (vuexContext, { username }) {
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

    saveUsernameToDatabase (vuexContext, { usernameDetails }) {
      const username = usernameDetails.username
      const token = vuexContext.state.token
      return this.$axios.$put(`${process.env.BASE_URL}/usernames/${username}.json?auth=${token}`, usernameDetails)
    },

    saveUserDetailsToDatabase (vuexContext, { userDetails }) {
      const userId = userDetails.userId
      const token = vuexContext.state.token
      return this.$axios.$put(`${process.env.BASE_URL}/users/${userId}.json?auth=${token}`, userDetails)
    },

    loginUser (vuexContext, authData) {
      const authUrl = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${process.env.FB_API_KEY}`
      
      return this.$axios.$post(authUrl, {
        email: authData.email,
        password: authData.password,
        returnSecureToken: true
      })
        .then(result => {       
          const setExpirationDate = new Date().getTime() + Number.parseInt(result.expiresIn) * 1000

          console.log('result', result)
          
          vuexContext.commit('SET_TOKEN', result.idToken)
          vuexContext.commit('SET_USERNAME', result.displayName)
          vuexContext.commit('SET_USERID', result.localId)
          
          localStorage.setItem('token', result.idToken)
          localStorage.setItem('tokenExpiration', setExpirationDate)
          localStorage.setItem('username', result.displayName)
          localStorage.setItem('userId', result.localId)

          Cookie.set('jwt', result.idToken)
          Cookie.set('expirationDate', setExpirationDate)
          Cookie.set('username', result.displayName)
          Cookie.set('userId', result.localId)

          return result
        })
        .catch((err) => {
          throw err.response.data.error
        })
    },

    registerUser (vuexContext, authData) {
      const authUrl = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${process.env.FB_API_KEY}`
      
      return this.$axios.$post(authUrl, {
        email: authData.email,
        password: authData.password,
        displayName: authData.username,
        accountType: authData.accountType,
        returnSecureToken: true
      })
        .then(result => {    
          console.log('RESULT', result)   
          const setExpirationDate = new Date().getTime() + Number.parseInt(result.expiresIn) * 1000
          
          vuexContext.commit('SET_TOKEN', result.idToken)
          vuexContext.commit('SET_USERNAME', result.displayName)
          vuexContext.commit('SET_USERID', result.localId)

          localStorage.setItem('token', result.idToken)
          localStorage.setItem('tokenExpiration', setExpirationDate)
          localStorage.setItem('username', result.displayName)
          localStorage.setItem('userId', result.localId)

          Cookie.set('jwt', result.idToken)
          Cookie.set('expirationDate', setExpirationDate)
          Cookie.set('username', result.displayName)
          cookie.set('userId', result.localId)

          return result
        })
        .catch((err) => {
          throw err.response.data.error
        })
    },

    initAuth (vuexContext, req) {
      let token
      let expirationDate
      let username
      let userId

      if (req) {
        if (!req.headers.cookie) {
          vuexContext.commit('CLEAR_TOKEN')
          vuexContext.commit('CLEAR_USERNAME')
          vuexContext.commit('CLEAR_USERID')
          return
        }

        let jwtCookie = req.headers.cookie
          .split(';')
          .find(c => c.trim().startsWith('jwt='))

        let usernameCookie = req.headers.cookie
          .split(';')
          .find(c => c.trim().startsWith('username='))

        let userIdCookie = req.headers.cookie
          .split(';')
          .find(c => c.trim().startsWith('userId='))
        
        if (!jwtCookie) {
          return
        }
        token = jwtCookie.split('=')[1]
        expirationDate = req.headers.cookie
          .split(';')
          .find(c => c.trim().startsWith('expirationDate='))
          .split('=')[1]
        username = usernameCookie.split('=')[1]
        userId = userIdCookie.split('=')[1]
      } else if (process.client) {
        token = localStorage.getItem('token')
        expirationDate = localStorage.getItem('tokenExpiration')
        username = localStorage.getItem('username')
        userId = localStorage.getItem('userId')
      }

      if (new Date().getTime() > Number(expirationDate) || !token) {
        console.log('no token or invalid token')
        vuexContext.dispatch('logout')
        return
      }

      vuexContext.commit('SET_TOKEN', token)
      vuexContext.commit('SET_USERNAME', username)
      vuexContext.commit('SET_USERID', userId)
    },

    logout (vuexContext) {
      vuexContext.commit('CLEAR_TOKEN')
      vuexContext.commit('CLEAR_USERNAME')
      vuexContext.commit('CLEAR_USERID')
      Cookie.remove('jwt')
      Cookie.remove('expirationDate')
      Cookie.remove('username')
      Cookie.remove('userId')

      if (process.client) {
        localStorage.removeItem('token')
        localStorage.removeItem('tokenExpiration')
        localStorage.removeItem('username')
        localStorage.removeItem('userId')
      }
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