// import Cookie from 'js-cookie'
import axios from 'axios'
import { baseURL } from '~/config.js'
import qs from 'qs'

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
      console.log('register data', data)
      return axios({
        method: 'post',
        url: `${baseURL}/user/signup`,
        data,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },

    token: (data) => {
      console.log('DATA', data)
      const instance = axios.create()
      return instance({
        method: 'post',
        url: `${baseURL}/user/token`,
        data,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }
  },

  user: {
    updateCartReferences: (data) => {
      return axios({
        method: 'put',
        url: `${baseURL}/customers/${data.customer_id}`,
        headers: {
          'Content-Type': 'application/json'
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

  shop: {
    createShop: (data) => {
      return axios({
        method: 'post',
        url: `${baseURL}/shop/`,
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          name: data.username,
          step: 0
        }
      })
    },

    updateShop: (data) => {
      console.log('data', data)
      return axios({
        method: 'put',
        url: `${baseURL}/shop/${data.shopId}`,
        headers: {
          'Content-Type': 'application/json'
        },
        data: data.data
      })
    },

    fetchShop: (shopId) => {
      return axios({
        method: 'get',
        url: `${baseURL}/shop/${shopId}`,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },

    updateShopPreferences: () => {

    }
  },

  stripe: {
    createAccount: (data) => {
      return axios({
        method: 'post',
        url: `${baseURL}/stripe/create-account`,
        data,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },

    fetchAccount: (data) => {
      return axios({
        method: 'get',
        url: `${baseURL}/stripe/fetch-account`,
        data,
        headers: {
          'Content-Type': 'application/json'
        }
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

    vendorProducts: () => {
      return axios({
        method: 'get',
        url: `${baseURL}/vendor-products`,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },

    vendorProduct: (productId) => {
      return axios({
        method: 'get',
        url: `${baseURL}/vendor-products/${productId}`,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },

    updateProduct: (data) => {
      return axios({
        method: 'put',
        url: `${baseURL}/products/${data.productId}`,
        data: qs.stringify(data),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
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
        url: `${baseURL}/products/${productId}`
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
