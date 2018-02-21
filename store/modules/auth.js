import Cookie from 'cookie-js'

const store = {
  state: {
    token: null
  },

  mutations: {
    SET_TOKEN (state, token) {
      state.token = token
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
          console.log('RESULT', result)
          const setExpirationData = new Date().getTime() + Number.parseInt(result.expiresIn) * 1000

          vuexContext.commit('SET_TOKEN', result.idToken)
          localStorage.setItem('token', result.idToken)
          localStorage.setItem('tokenExpiration', setExpirationData)

          Cookie.set('jwt', result.idToken)
          Cookie.set('expirationData', setExpirationData)
        })
        .catch(err => err)
    }
  },

  getters: {}
}

export default store