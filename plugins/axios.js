// import { baseURL } from '~/config'
// import Cookie from 'js-cookie'
// import axios from 'axios'
// import qs from 'qs'

export default ({ store }) => {
  // function refreshToken () {
  //   console.log('set token')
  //   const payload = {
  //     client_id: process.env.MOLTIN_CLIENT_ID,
  //     client_secret: process.env.MOLTIN_CLIENT_SECRET,
  //     grant_type: 'client_credentials'
  //   }
  //   const instance = axios.create()

  //   return instance.post('oauth/access_token', qs.stringify(payload))
  //     .then(res => {
  //       console.log('set token 3', res)
  //       axios.defaults.headers.common['moltinAccessToken'] = res.data.access_token
  //       axios.defaults.headers.common['moltinExpiry'] = res.data.expires

  //       store.commit('moltin/SET_MOLTIN_TOKEN', res.data.access_token)
  //       store.commit('moltin/SET_MOLTIN_EXPIRY', res.data.expires)

  //       if (process.client) {
  //         localStorage.setItem('moltinAccessToken', res.data.access_token)
  //         localStorage.setItem('moltinExpiry', res.data.expires)
  //       }

  //       return res.data
  //     })
  //     .catch(err => {
  //       console.log('ERROR one', err)
  //       return err
  //     })
  // }
  // function refreshToken () {
  //   const data = {
  //     client_id: process.env.MOLTIN_CLIENT_ID,
  //     client_secret: process.env.MOLTIN_CLIENT_SECRET,
  //     grant_type: 'client_credentials'
  //   }

  //   return axios({
  //     method: 'post',
  //     url: 'oauth/access_token',
  //     data: qs.stringify(data)
  //   })
  //     .then(res => {
  //       console.log('RES', res)
  //       const token = res.data.access_token
  //       console.log('TOKEN', token)
  //       store.commit('moltin/SET_MOLTIN_CREDENTIALS', res.data)

  //       Cookie.set('moltin-access-token', res.data.access_token)
  //       Cookie.set('moltin-expiry', res.data.expires)
  //       // originalRequest.headers['authorization'] = `Bearer ${token}`

  //       if (process.client) {
  //         localStorage.setItem('moltin-access-token', res.data.access_token)
  //         localStorage.setItem('moltin-expiry', res.data.expires)
  //       }
  //       // return axios(originalRequest)
  //     })
  //     .catch(err => {
  //       console.log('knob', err)
  //     })
  // }

  // axios.defaults.baseURL = baseURL

  // axios.interceptors.request.use(req => {
  //   const token = store.getters['moltin/token']

  //   req.baseURL = baseURL

  //   if (token) {
  //     req.headers['authorization'] = `Bearer ${token}`
  //   }

  //   return req
  // })

  // axios.interceptors.response.use(response => {
  //   return response
  // }, err => {
  //   console.log('hello', err.message)
  //   console.log('bye', err.status)
  //   console.log('geroge', err.config)
  //   console.log('geroge2', err.error)

  //   console.log('error here', err.response.status === 401)
  //   // let deferred = Promise.defer()
  //   let originalRequest = err.config

  //   if (err.response.status === 401) {
  //     console.log('dispatch')
  //     refreshToken()
  //       .then(() => {
  //         return axios(originalRequest)
  //       })
  //       // store.dispatch('moltin/setToken')
  //       //   .then(() => {
  //       //
  //       //   })
  //       // const data = {
  //       //   client_id: process.env.MOLTIN_CLIENT_ID,
  //       //   client_secret: process.env.MOLTIN_CLIENT_SECRET,
  //       //   grant_type: 'client_credentials'
  //       // }
  //       // console.log('shit head', qs.stringify(data))
  //       // // originalRequest._retry = true
  //       // // axios.headers['authorization'] = null
  //       // // originalRequest.headers['content-type'] = 'application/x-www-form-urlencoded'
  //       // console.log(1)
  //       // console.log(2)
  //       // return axios({
  //       //   method: 'post',
  //       //   url: 'oauth/access_token',
  //       //   data: qs.stringify(data)
  //       // })
  //       //   .then(res => {
  //       //     console.log('RES', res)
  //       //     const token = res.data.access_token
  //       //     console.log('TOKEN', token)
  //       //     store.commit('moltin/SET_MOLTIN_CREDENTIALS', res.data)

  //       //     Cookie.set('moltin-access-token', res.data.access_token)
  //       //     originalRequest.headers['authorization'] = `Bearer ${token}`

  //       //     if (process.client) {
  //       //       localStorage.setItem('moltin-access-token', res.data.access_token)
  //       //     }
  //       //     return axios(originalRequest)
  //       //   })
  //       //   .catch(err => {
  //       //     console.log('knob', err)
  //       //   })
  //   }
  // })

  // axios.interceptors.response.use(undefined, (err) => {
  //   console.log('monkey error 4', err.response)
  //   console.log('monkey error 6', err.response.status)
  //   const originalRequest = err.config

  //   if (err.response.status === 401) {
  //     console.log('refresh token')
  //     console.log('headers', err)
  //     err.config.headers['authorization'] = null
  //     return store.dispatch('moltin/credentials')
  //       .then((token) => {
  //         console.log('new token', token)

  //         axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  //         originalRequest.headers['Authorization'] = `Bearer ${token}`
  //         console.log('shit head 2', axios.defaults)
  //         // return axios(originalRequest)
  //       })
  //   }

  //   // return Promise.reject(err)
  // })
}
