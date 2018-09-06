// import { baseURL } from '~/config'
import Cookie from 'js-cookie'
import cookie from 'cookie'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import api from '~/api'

export default (context) => {
  let token
  let refreshToken
  let userId

  axios.interceptors.request.use((response) => {
    let originalRequest = response
    const isAuthenticated = context.store.getters['auth/isAuthenticated']

    if (process.server) {
      console.log('is server')
      if (!context.req.headers.cookie) return
      token = cookie.parse(context.req.headers.cookie)['token']

      if (token) {
        refreshToken = cookie.parse(context.req.headers.cookie)['refreshToken']
        userId = cookie.parse(context.req.headers.cookie)['userId']
      }
    } else {
      token = localStorage.getItem('token')
      refreshToken = localStorage.getItem('refreshToken')
      userId = localStorage.getItem('userId')
    }

    if (isAuthenticated) {
      const decodedToken = jwt.decode(token)
      const expiry = decodedToken.exp
      const currentDate = Math.floor(new Date() / 1000)

      if (currentDate >= expiry) {
        console.log('HERE GEORGE')
        return api.auth.token({ userId, refresh_token: refreshToken })
          .then(result => {
            console.log('MONKEY BOY')
            Cookie.set('token', result.data.token)
            Cookie.set('refreshToken', result.data.refresh_token)
            context.store.commit('auth/SET_TOKEN', result.data.token, { root: true })

            if (process.client) {
              localStorage.setItem('token', result.data.token)
              localStorage.setItem('refreshToken', result.data.refresh_token)
            }

            originalRequest.headers['Authorization'] = `Bearer ${result.data.token}`
            return Promise.resolve(originalRequest)
          })
          .catch(() => {
            // Refresh token has expired so sign user out.
            console.log('catched error')
            context.store.dispatch('auth/logout')
            context.redirect('/logout')
          })
      }

      return response
    }
    return response
  }, err => {
    console.log('error here baby', err)
    return Promise.reject(err)
  })

  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}
