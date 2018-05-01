import axios from 'axios'
import qs from 'qs'
import { version } from '~/config.js'

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
        url: `${version}/customers/tokens`,
        data: { data },
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },

    register: (data) => {
      console.log('data', data)
      return axios({
        method: 'post',
        url: `${version}/customers`,
        data: {
          data
        },
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }
  },

  user: (data) => {
    return axios({
      method: 'get',
      url: `${version}/customers/${data.customer_id}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'x-moltin-customer-token': data.customer_token
      }
    })
  },

  products: {
    categories: () => {
      return axios({
        method: 'get',
        url: `${version}/categories`
      })
    },

    createProduct: (data) => {
      return axios({
        method: 'post',
        url: `${version}/products`,
        data: { data },
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },

    brandId: (data) => {
      return axios({
        method: 'get',
        url: `${version}/brands?filter=eq(slug,${data.customerId})`
      })
    },

    brands: (data) => {
      return axios({
        method: 'post',
        url: `${version}/brands`,
        data: { data },
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },

    brandRelationship: (data) => {
      return axios({
        method: 'post',
        url: `${version}/products/${data.productId}/relationships/brands`,
        data: {
          data: [{
            type: 'brand',
            id: data.brandId
          }]
        },
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }

  }
}
