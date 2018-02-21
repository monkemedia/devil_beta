import Cookie from 'js-cookie'

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
    authenticateUser (vuexContext, authData) {
      const authUrl = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${process.env.FBAPIKEY}`
      
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
        .catch(err => err)
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