import Cookie from 'js-cookie'
import _ from 'lodash'

const store = {
  namespaced: true,

  state: {
    token: null,
    username: null
  },

  mutations: {
    SET_TOKEN (state, token) {
      state.token = token
    },

    SET_USERNAME (state, username) {
      state.username = username
    },

    CLEAR_USERNAME (state) {
      state.username = null
    },

    CLEAR_TOKEN (state) {
      state.token = null
    }
  },

  actions: {
    validateUsername (vuexContext, { username }) {
      console.log('1')
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
      console.log('2 save to db')
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
          
          localStorage.setItem('token', result.idToken)
          localStorage.setItem('tokenExpiration', setExpirationDate)
          localStorage.setItem('username', result.displayName)

          Cookie.set('jwt', result.idToken)
          Cookie.set('expirationDate', setExpirationDate)
          Cookie.set('username', result.displayName)

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

          localStorage.setItem('token', result.idToken)
          localStorage.setItem('tokenExpiration', setExpirationDate)
          localStorage.setItem('username', result.displayName)

          Cookie.set('jwt', result.idToken)
          Cookie.set('expirationDate', setExpirationDate)
          Cookie.set('username', result.displayName)

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

      if (req) {
        if (!req.headers.cookie) {
          vuexContext.commit('CLEAR_TOKEN')
          vuexContext.commit('CLEAR_USERNAME')
          return
        }

        const jwtCookie = req.headers.cookie
          .split(';')
          .find(c => c.trim().startsWith('jwt='))

        let usernameCookie = req.headers.cookie
          .split(';')
          .find(c => c.trim().startsWith('username='))
        
        if (!jwtCookie) {
          return
        }
        token = jwtCookie.split('=')[1]
        expirationDate = req.headers.cookie
          .split(';')
          .find(c => c.trim().startsWith('expirationDate='))
          .split('=')[1]
        username = usernameCookie.split('=')[1]
      } else if (process.client) {
        token = localStorage.getItem('token')
        expirationDate = localStorage.getItem('tokenExpiration')
        username = localStorage.getItem('username')
      }

      if (new Date().getTime() > Number(expirationDate) || !token) {
        console.log('no token or invalid token')
        vuexContext.dispatch('logout')
        return
      }

      vuexContext.commit('SET_TOKEN', token)
      vuexContext.commit('SET_USERNAME', username)
    },

    logout (vuexContext) {
      vuexContext.commit('CLEAR_TOKEN')
      vuexContext.commit('CLEAR_USERNAME')
      Cookie.remove('jwt')
      Cookie.remove('expirationDate')
      Cookie.remove('username')

      if (process.client) {
        localStorage.removeItem('token')
        localStorage.removeItem('tokenExpiration')
        localStorage.removeItem('username')
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
    }
  }
}

export default store