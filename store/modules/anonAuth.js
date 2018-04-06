import { setAnonAuthToken, setAnonAuthUid, setAnonAuthRefreshToken, setAnonExpirationDate, resetAnonAuth } from '~/utils/anonAuth'
import Cookies from 'js-cookie'

const store = {
  namespaced: true,

  state: {
    token: null,
    uid: null
  },

  mutations: {
    SET_TOKEN (state, payload) {
      state.token = payload
    },

    SET_UID (state, payload) {
      state.uid = payload
    },

    CLEAR_TOKEN (state) {
      state.token = null
    },

    CLEAR_UID (state) {
      state.uid = null
    }
  },

  actions: {
    initAuth ({ dispatch, commit, getters }, req) {
      let token
      let uid
      let refreshToken
      let expirationDate
      let vm = this

      console.log('anon auth')

      function refreshAnonToken (refreshTok) {
        console.log('DEVIL', refreshTok)
        const authUrl = `https://securetoken.googleapis.com/v1/token?key=${process.env.FB_API_KEY}`
        return vm.$axios.$post(authUrl, {
          grant_type: 'refresh_token',
          refresh_token: refreshTok
        })
      }

      if (req) {
        if (!req.headers.cookie) {
          console.log('RESET ANON AUTH')
          commit('CLEAR_TOKEN')
          commit('CLEAR_UID')
          resetAnonAuth()
          return
        }
        console.log('here 2')
        let anonToken = req.headers.cookie
          .split(';')
          .find(c => c.trim().startsWith('anon-token='))
        let anonUid = req.headers.cookie
          .split(';')
          .find(c => c.trim().startsWith('anon-uid='))
        let anonRefreshToken = req.headers.cookie
          .split(';')
          .find(c => c.trim().startsWith('anon-refresh-token='))
        let anonExpirationDate = req.headers.cookie
          .split(';')
          .find(c => c.trim().startsWith('anon-expiration-date='))

        if (!anonToken) {
          console.log('not here')
          return
        }

        console.log('here 3')

        token = anonToken.split('=')[1]
        uid = anonUid.split('=')[1]
        refreshToken = anonRefreshToken.split('=')[1]
        expirationDate = anonExpirationDate.split('=')[1]

        setAnonAuthToken(token)
        setAnonAuthUid(uid)
        setAnonAuthRefreshToken(refreshToken)
        setAnonExpirationDate(expirationDate)

        commit('SET_UID', uid)

        console.log('expiration date', expirationDate)
        console.log('RT', refreshToken)

        if (new Date().getTime() >= expirationDate) {
          console.log('TOKEN HAS EXPIRED')
          return refreshAnonToken(refreshToken)
            .then((result) => {
              console.log('REFRESH_RESULT', result.id_token)
              const setExpirationDate = new Date().getTime() + parseInt(result.expires_in) * 1000

              commit('SET_TOKEN', result.id_token)

              setAnonAuthToken(result.id_token)
              setAnonAuthRefreshToken(result.refreshToken)
              setAnonExpirationDate(setExpirationDate)
            })
            .catch((err) => {
              console.log(err.response.data.error)
              throw err
            })
        } else {
          console.log('KERE', token)
          commit('SET_TOKEN', token)
        }
      } else if (process.client) {
        token = Cookies.get('anon-token')
        uid = Cookies.get('anon-uid')
        refreshToken = Cookies.get('anon-refresh-token')
        expirationDate = Cookies.get('anon-expiration-date')
      }
    },

    logoutUser ({ commit }) {
      console.log('ANON LOGOUT')
      commit('CLEAR_TOKEN')
      commit('CLEAR_UID')

      Cookies.remove('anon-token')
      Cookies.remove('anon-uid')
      Cookies.remove('anon-refresh-token')
      Cookies.remove('anon-expiration-date')

      resetAnonAuth()
    },

    signInUser ({ commit }) {
      console.log('signInUser')
      const authUrl = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${process.env.FB_API_KEY}`

      return this.$axios.$post(authUrl, {
        returnSecureToken: true
      })
        .then((result) => {
          const setExpirationDate = new Date().getTime() + parseInt(result.expiresIn) * 1000

          commit('SET_TOKEN', result.idToken)
          commit('SET_UID', result.localId)

          setAnonAuthToken(result.idToken)
          setAnonAuthUid(result.localId)
          setAnonAuthRefreshToken(result.idToken)
          setAnonExpirationDate(setExpirationDate)

          Cookies.set('anon-token', result.idToken)
          Cookies.set('anon-uid', result.localId)
          Cookies.set('anon-refresh-token', result.refreshToken)
          Cookies.set('anon-expiration-date', setExpirationDate)

          return result
        })
    }
  },

  getters: {
    isAuthenticated (state) {
      return !!state.token
    },

    token (state) {
      return state.token
    },

    uid (state) {
      return state.uid
    }
  }
}

export default store
