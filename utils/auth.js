import axios from 'axios'

export function setAuthToken (token) {
  axios.defaults.headers.common['token'] = token || ''
}

export function setAuthUid (uid) {
  axios.defaults.headers.common['uid'] = uid || ''
}

export function setAuthUsername (username) {
  axios.defaults.headers.common['username'] = username || ''
}

export function setAuthRefreshToken (refreshToken) {
  axios.defaults.headers.common['refresh-token'] = refreshToken || ''
}

export function setAuthExpirationDate (expirationDate) {
  axios.defaults.headers.common['expiration-date'] = expirationDate || ''
}

export function resetAuth () {
  delete axios.defaults.headers.common['token']
  delete axios.defaults.headers.common['uid']
  delete axios.defaults.headers.common['username']
  delete axios.defaults.headers.common['refresh-token']
  delete axios.defaults.headers.common['expiration-date']
}
