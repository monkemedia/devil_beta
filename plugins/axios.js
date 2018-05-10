import { baseURL } from '~/config'
import axios from 'axios'

export default ({ store }) => {
  axios.defaults.baseURL = baseURL

  axios.interceptors.request.use(req => {
    const token = store.getters['moltin/accessToken']
    req.baseURL = baseURL

    if (token) {
      req.headers['authorization'] = `Bearer ${token}`
    }

    return req
  })

  axios.interceptors.response.use(undefined, (err) => {
    console.log('monkey error 4', err.response)
    console.log('monkey error 6', err.response.status)
    const originalRequest = err.config

    if (err.response.status === 401) {
      console.log('refresh token')
      console.log('headers', err)
      err.config.headers['authorization'] = null
      return store.dispatch('moltin/credentials')
        .then((token) => {
          console.log('new token', token)

          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
          originalRequest.headers['Authorization'] = `Bearer ${token}`
          console.log('shit head 2', axios.defaults)
          // return axios(originalRequest)
        })
    }

    // return Promise.reject(err)
  })
}
