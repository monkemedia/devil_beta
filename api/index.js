// import Cookie from 'js-cookie'
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
        .then(res => {
          return res
        })
        .catch(err => {
          return err
        })
    },

    categoryRelationship: (data) => {
      console.log('categoryRelationship', data)
      return axios({
        method: 'post',
        url: `${version}/products/${data.productId}/relationships/categories`,
        data: {
          data: [{
            type: 'category',
            id: data.categoryId
          }]
        },
        headers: {
          'Content-Type': 'application/json'
        }
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

    merchantProducts: (brandId) => {
      return axios({
        method: 'get',
        url: `${version}/products?filter=eq(brand.id,${brandId})`,
        headers: {
          'X-Moltin-Language': 'en'
        }
      })
    },

    updateProduct: (data) => {
      return axios({
        method: 'put',
        url: `${version}/products/${data.productId}`,
        data: {
          data: data.payload
        },
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },

    deleteProduct: (productId) => {
      return axios({
        method: 'delete',
        url: `${version}/products/${productId}`
      })
    },

    brandId: (data) => {
      return axios({
        method: 'get',
        url: `${version}/brands?filter=eq(slug,${data.customerId})`,
        headers: {
          'authorization': `Bearer ${data.moltinToken}`
        }
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
    },

    product: (productId) => {
      return axios({
        method: 'get',
        url: `${version}/products/${productId}`,
        headers: {
          'X-Moltin-Language': 'en'
        }
      })
    }
  }
}
