import axios from 'axios'
import qs from 'qs'

export default {
  moltin: {
    credentials: (data) => {
      return axios({
        method: 'post',
        url: 'oauth/access_token',
        data: qs.stringify(data),
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        }
      })
    }
  },

  auth: {
    login: (data) => {
      return axios({
        method: 'post',
        url: 'v2/customers/tokens',
        data: { data },
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }
  },

  user: (data) => {
    console.log('DATA', data)
    return axios({
      method: 'get',
      url: `v2/customers/${data.customer_id}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'x-moltin-customer-token': data.customer_token
      }
    })
  }
}
