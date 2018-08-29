// import { baseURL } from '~/config'
import Cookie from 'js-cookie'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import api from '~/api'

export default (context) => {
  let token
  let refreshToken
  let userId

  if (process.server) {
    if (!context.req.headers.cookie) return
    const tokenCookie = context.req.headers.cookie
      .split(';')
      .find(c => c.trim().startsWith('token='))

    const refreshTokenCookie = context.req.headers.cookie
      .split(';')
      .find(c => c.trim().startsWith('refreshToken='))

    const userIdCookie = context.req.headers.cookie
      .split(';')
      .find(c => c.trim().startsWith('userId='))

    token = tokenCookie.substring(tokenCookie.indexOf('=') + 1)
    refreshToken = refreshTokenCookie.substring(refreshTokenCookie.indexOf('=') + 1)
    userId = userIdCookie.substring(userIdCookie.indexOf('=') + 1)
  } else {
    token = localStorage.getItem('token')
    refreshToken = localStorage.getItem('refreshToken')
    userId = localStorage.getItem('userId')
  }

  axios.interceptors.request.use((response) => {
    let originalRequest = response
    const isAuthenticated = context.store.getters['auth/isAuthenticated']

    if (isAuthenticated) {
      const decodedToken = jwt.decode(token)
      const expiry = decodedToken.exp
      const currentDate = Math.floor(new Date() / 1000)

      if (currentDate >= expiry) {
        return api.auth.token({ userId, refresh_token: refreshToken })
          .then(result => {
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

      originalRequest.headers['Authorization'] = `Bearer ${token}`
      return response
    }
    return response
  }, err => {
    console.log('error here baby', err)
    return Promise.reject(err)
  })

  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}
