import axios from 'axios'

export function setAnonAuthToken (token) {
  axios.defaults.headers.common['anon-token'] = token || ''
}

export function setAnonAuthUid (uid) {
  axios.defaults.headers.common['anon-uid'] = uid || ''
}

export function setAnonAuthRefreshToken (refreshToken) {
  axios.defaults.headers.common['anon-refresh-token'] = refreshToken || ''
}

export function setAnonExpirationDate (expirationDate) {
  axios.defaults.headers.common['anon-expiration-date'] = expirationDate || ''
}

export function resetAnonAuth () {
  delete axios.defaults.headers.common['anon-token']
  delete axios.defaults.headers.common['anon-uid']
  delete axios.defaults.headers.common['anon-refresh-token']
  delete axios.defaults.headers.common['anon-expiration-date']
}
