import Cookie from 'js-cookie'
import _ from 'lodash'

const store = {
  state: {
    token: null
  },

  mutations: {
    SET_TOKEN (state, token) {
      state.token = token
    },

    CLEAR_TOKEN (state) {
      state.token = null
    }
  },

  actions: {
    validateUsername (state, { username }) {
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

    loginUser (vuexContext, authData) {
      const authUrl = `https:\\/\\/www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${process.env.FB_API_KEY}`
      
      return this.$axios.$post(authUrl, {
        email: authData.email,
        password: authData.password,
        returnSecureToken: true
      })
        .then(result => {       
          const setExpirationDate = new Date().getTime() + Number.parseInt(result.expiresIn) * 1000
          vuexContext.commit('SET_TOKEN', result.idToken)
          localStorage.setItem('token', result.idToken)
          localStorage.setItem('tokenExpiration', setExpirationDate)

          Cookie.set('jwt', result.idToken)
          Cookie.set('expirationDate', setExpirationDate)
        })
        .catch((err) => {
          throw err.response.data.error
        })
    },

    registerUser (vuexContext, authData) {
      const authUrl = `https:\\/\\/www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${process.env.FB_API_KEY}`
      const username = authData.username
      vuexContext.dispatch('validateUsername', { username })
        .then((response) => {
          console.log(response)
          // return this.$axios.$post(authUrl, {
          //   email: authData.email,
          //   password: authData.password,
          //   username: authData.username,
          //   accountType: authData.accountType,
          //   returnSecureToken: true
          // })
        })
        .catch((err) => {
          console.log('ERROR', err)
        })
      // return this.$axios.$post(authUrl, {
      //   email: authData.email,
      //   password: authData.password,
      //   username: authData.username,
      //   accountType: authData.accountType,
      //   returnSecureToken: true
      // })
      //   .then(result => {       
      //     const setExpirationDate = new Date().getTime() + Number.parseInt(result.expiresIn) * 1000
      //     vuexContext.commit('SET_TOKEN', result.idToken)
      //     localStorage.setItem('token', result.idToken)
      //     localStorage.setItem('tokenExpiration', setExpirationDate)

      //     Cookie.set('jwt', result.idToken)
      //     Cookie.set('expirationDate', setExpirationDate)
      //   })
      //   .catch((err) => {
      //     throw err.response.data.error
      //   })
    },

    initAuth (vuexContext, req) {
      let token
      let expirationDate

      if (req) {
        if (!req.headers.cookie) {
          return
        }

        let jwtCookie = req.headers.cookie
          .split(';')
          .find(c => c.trim().startsWith('jwt='))
        
        if (!jwtCookie) {
          return
        }
        token = jwtCookie.split('=')[1]
        expirationDate = req.headers.cookie
          .split(';')
          .find(c => c.trim().startsWith('expirationDate='))
          .split('=')[1]
      } else if (process.client) {
        token = localStorage.getItem('token')
        expirationDate = localStorage.getItem('tokenExpiration')
      }

      if (new Date().getTime() > parseInt(expirationDate) || !token) {
        console.log('no token or invalid token')
        vuexContext.dispatch('logout')
        return
      }
      vuexContext.commit('SET_TOKEN', token)
    },

    logout (vuexContext) {
      vuexContext.commit('CLEAR_TOKEN')
      Cookie.remove('jwt')
      Cookie.remove('expirationDate')

      if (process.client) {
        localStorage.removeItem('token')
        localStorage.removeItem('tokenExpiration')
      }
    }
  },

  getters: {
    isAuthenticated (state) {
      return state.token != null
    }
  }
}

export default store