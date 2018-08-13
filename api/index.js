// import Cookie from 'js-cookie'
import axios from 'axios'
import { baseURL } from '~/config.js'

export default {
  auth: {
    login: (data) => {
      return axios({
        method: 'post',
        url: `${baseURL}/user/login`,
        data,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },

    register: (data) => {
      return axios({
        method: 'post',
        url: `${baseURL}/user/signup`,
        data,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }
  },

  user: {
    updateCartReferences: (data) => {
      console.log('DATA', data)
      return axios({
        method: 'put',
        url: `${baseURL}/customers/${data.customer_id}`,
        headers: {
          'Content-Type': 'application/json',
          'x-moltin-customer-token': data.customer_token
        },
        data: {
          data: {
            'type': 'customer',
            'cart_reference': data.cart_reference
          }
        }
      })
    },

    getCartReferences: (data) => {
      return axios({
        method: 'get',
        url: `${baseURL}/customers/${data.customer_id}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'x-moltin-customer-token': data.customer_token
        }
      })
        .then(res => {
          return res.data.data.cart_reference
        })
    }
  },

  products: {
    createProduct: (data) => {
      return axios({
        method: 'post',
        url: `${baseURL}/products`,
        data,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },

    vendorProducts: (brandId) => {
      return axios({
        method: 'get',
        url: `${baseURL}/products?filter=eq(brand.id,${brandId})`,
        headers: {
          'X-Moltin-Language': 'en'
        }
      })
    },

    updateProduct: (data) => {
      return axios({
        method: 'put',
        url: `${baseURL}/products/${data.productId}`,
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
        url: `${baseURL}/products/${productId}`
      })
    },

    product: (productId) => {
      return axios({
        method: 'get',
        url: `${baseURL}/products/${productId}`,
        headers: {
          'X-Moltin-Language': 'en'
        }
      })
    }
  },

  inventory: {
    stock: (productId) => {
      return axios({
        method: 'get',
        url: `${baseURL}/inventories/${productId}`
      })
    }
  },

  cart: {
    addToCart: (data) => {
      return axios({
        method: 'post',
        url: `${baseURL}/carts/${data.cart_reference}/items`,
        data: data.payload,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },

    updateCartItemQuantity: (data) => {
      return axios({
        method: 'put',
        url: `${baseURL}/carts/${data.cart_reference}/items/${data.item_id}`,
        data: {
          data: {
            quantity: data.quantity,
            type: 'cart_item'
          }
        },
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },

    fetchCartData: (reference) => {
      console.log('come on', reference)
      return axios({
        method: 'get',
        url: `${baseURL}/carts/${reference}/items`
      })
    }
  }
}
