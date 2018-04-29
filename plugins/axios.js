import { baseURL } from '~/config'
import axios from 'axios'

export default ({ store }) => {
  axios.defaults.baseURL = baseURL

  if (process.server) {
    return
  }

  axios.interceptors.request.use(request => {
    request.baseURL = baseURL

    // Get token from auth.js store
    const token = store.getters['moltin/getCredentials']

    // Update token axios header
    if (token) {
      request.headers.common['authorization'] = `Bearer ${token.access_token}`
    }
    return request
  })
}
