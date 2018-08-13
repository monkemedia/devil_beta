import Vue from 'vue'
import _ from 'lodash'
import api from '~/api'
import uuidv4 from 'uuid/v4'

const state = () => ({
  cartItems: []
})

const mutations = {
  SET_CART_ITEMS (state, payload) {
    state.cartItems.push(payload)
  },

  UPDATE_QUANTITY (state, payload) {
    state.cartItems.forEach((items, index) => {
      items.forEach((it, i) => {
        if (it.sku === payload.sku) {
          const updatedQty = it.quantity += payload.quantity
          Vue.set(state.cartItems[index][i], 'quantity', updatedQty)
        }
      })
    })
  },

  ADD_PRODUCT_TO_EXISTING_REF (state, payload) {
    state.cartItems.forEach((items, index) => {
      items.forEach((it, i) => {
        if (it.cart_reference === payload.cart_reference) {
          delete payload.cart_reference
          Vue.set(state.cartItems, [index], payload)
        }
      })
    })
  },

  CLEAR_CART_ITEMS (state) {
    state.cartItems = []
  }
}

const actions = {
  fetchCartReferences ({ rootGetters }) {
    const customerId = rootGetters['auth/getCustomerId']
    const customerToken = rootGetters['auth/getToken']

    if (!customerToken) {
      return
    }

    return api.user.getCartReferences({
      customer_id: customerId,
      customer_token: customerToken
    })
  },

  addItemToLocalStorage ({ commit }, payload) {
    let cartArray = []
    const storeReferences = localStorage.getItem('cartItems')

    if (storeReferences && storeReferences.length > 0) {
      cartArray = JSON.parse(storeReferences)
      cartArray.push(payload)
      localStorage.setItem('cartItems', JSON.stringify(cartArray))
      return cartArray
    }

    cartArray.push(payload)
    localStorage.setItem('cartItems', JSON.stringify(cartArray))
    return payload
  },

  localStorageToMoltin ({ state, commit, getters, rootGetters, dispatch }, localCartReferences) {
    // when user signs in, lets see if they have cart references in local storage
    const customerId = rootGetters['auth/getCustomerId']
    const customerToken = rootGetters['auth/getToken']

    // there are cart refernences in local storage, so lets add them to moltin
    return dispatch('fetchCartReferences')
      .then(currentReferences => {
        return api.cart.fetchCartData(currentReferences)
          .then(res => {
            // There are no store references in Moltin, so just add reference from localStorage straight to Moltin
            if (!res.data.data.length) {
              console.log('updateCartReferences')
              return dispatch('user/updateCartReferences', {
                customer_id: customerId,
                cart_reference: localCartReferences.join(','),
                customer_token: customerToken
              }, { root: true })
            } else {
              // There are references in moltin, so lets see if products already exist
              return dispatch('fetchCartData')
                .then(() => {
                  const cartData = res.data.data
                  const currentCartItems = _.flattenDeep(state.cartItems)
                  let productExists
                  let quantityFromMoltin

                  console.log('currentCartItems', currentCartItems)

                  productExists = _.map(cartData, res => {
                    return _.filter(currentCartItems, item => {
                      return item.sku === res.sku
                    })
                  })

                  quantityFromMoltin = cartData.find(item => {
                    return item.sku === productExists[0][0].sku
                  })

                  console.log('quantityFromMoltin', quantityFromMoltin)

                  console.log('product exists', productExists)
                  if (productExists.length > 0) {
                    console.log('productExists', productExists)
                    // product exists, so lets just update quantity only
                    console.log('update quantity ONLY', productExists[0][0].quantity)
                    const quantity = productExists[0][0].quantity += quantityFromMoltin.quantity

                    console.log('QUANTITY', quantity)
                    console.log('PRODUCT ID', productExists[0][0].id)

                    return dispatch('updateCartItemQuantity', {
                      item_id: productExists[0][0].id,
                      cart_reference: productExists[0][0].cart_reference,
                      quantity
                    })
                      .then(res => {
                        console.log('moltin response', res)
                      })
                  }
                })
            }
          })
          .then(() => {
            // localStorage.removeItem('cartItems')
          })
      })
  },

  addToCart ({ dispatch, commit, rootGetters }, payload) {
    // Does user have cart reference all ready
    const product = rootGetters['products/loadedProduct']
    const customerId = rootGetters['auth/getCustomerId']
    const customerToken = rootGetters['auth/getToken']
    const vendorName = product['vendor_name']
    const reference = `${vendorName}_VENDOR_${uuidv4()}`
    const cookieReferences = JSON.parse(localStorage.getItem('cartItems'))

    // If user isnt logged in
    // Add items to localstorage for now
    if (!customerToken) {
      // Lets see if they have a cart reference in localStorage first
      if (!cookieReferences) {
        // There are no cookies so lets create one
        return dispatch('addItemToLocalStorage', reference)
          .then(() => {
            return api.cart.addToCart({
              payload,
              cart_reference: reference
            })
          })
          .then(res => {
            const data = res.data.data

            console.log('MONKEY BOY', data)

            data[0]['cart_reference'] = reference
            // Add products to Store
            commit('SET_CART_ITEMS', data)
          })
      } else {
        // There is a cookie, lets see if cart references match
        const filteredReference = cookieReferences.filter(ref => ref.includes(`${vendorName}_VENDOR`))

        if (filteredReference.length > 0) {
          // cart reference already exists, lets see if product exists
          return api.cart.fetchCartData(filteredReference[0])
            .then(res => {
              const productExists = res.data.data.filter(res => res.sku === payload.data.sku)

              if (productExists.length) {
                // Product exists, so lets update quantity only
                const quantity = productExists[0].quantity += payload.data.quantity

                return dispatch('updateCartItemQuantity', {
                  item_id: productExists[0].id,
                  cart_reference: filteredReference[0],
                  quantity
                })
                  .then(() => {
                    const data = {
                      quantity: payload.data.quantity,
                      sku: payload.data.sku
                    }
                    commit('UPDATE_QUANTITY', data)
                  })
              } else {
                // reference exists but no product, so set up new product
                return api.cart.addToCart({
                  payload,
                  cart_reference: filteredReference[0]
                })
                  .then(res => {
                    const data = res.data.data
                    const newArray = []

                    _.map(data, item => {
                      item['cart_reference'] = filteredReference[0]
                      newArray.push(item)
                    })

                    console.log('newArray', newArray)

                    commit('ADD_PRODUCT_TO_EXISTING_REF', newArray)
                  })
              }
            })
        } else {
          // Product doesn't exists, so lets add new cart reference to local storage
          // before adding it to moltin
          return dispatch('addItemToLocalStorage', reference)
            .then(() => {
              // Add new product to cart
              return api.cart.addToCart({
                payload,
                cart_reference: reference
              })
            })
            .then(res => {
              // Add products to Store
              const data = res.data.data

              data[0]['cart_reference'] = reference

              commit('SET_CART_ITEMS', data)
            })
        }
      }
    }

    return dispatch('fetchCartReferences')
      .then(currentReferences => {
        // If no references stored on Moltin
        if (!currentReferences) {
          // lets create a new reference for them
          return dispatch('user/updateCartReferences', {
            customer_id: customerId,
            cart_reference: reference,
            customer_token: customerToken
          }, { root: true })
            .then(() => {
              // Add new product to cart
              return api.cart.addToCart({
                payload,
                cart_reference: reference
              })
            })
            .then(res => {
              const data = res.data.data

              data[0]['cart_reference'] = reference

              // Add products to Store
              commit('SET_CART_ITEMS', data)
            })
        } else {
          // There is cart references stored on Moltin
          // Lets filter through them
          const cartReferenceArray = currentReferences.split(',')

          const filteredReference = cartReferenceArray.filter(ref => ref.includes(`${vendorName}_VENDOR`))

          if (filteredReference.length > 0) {
            return api.cart.fetchCartData(filteredReference[0])
              .then(res => {
                console.log('res', res)
                // cart reference already exists, lets see if product exists
                const productExists = res.data.data.filter(res => res.sku === payload.data.sku)

                if (productExists.length) {
                  console.log('HERE')
                  // Product exists, so lets update quantity only
                  const quantity = productExists[0].quantity += payload.data.quantity

                  return dispatch('updateCartItemQuantity', {
                    item_id: productExists[0].id,
                    cart_reference: filteredReference[0],
                    quantity
                  })
                    .then(() => {
                      const data = {
                        quantity: payload.data.quantity,
                        sku: payload.data.sku
                      }
                      commit('UPDATE_QUANTITY', data)
                    })
                } else {
                  // reference exists but no product, so set up new product
                  return api.cart.addToCart({
                    payload,
                    cart_reference: filteredReference[0]
                  })
                    .then(res => {
                      const data = res.data.data

                      const addBackReference = _.map(data, item => {
                        item['cart_reference'] = filteredReference[0]
                        return item
                      })

                      addBackReference['cart_reference'] = filteredReference[0]

                      commit('ADD_PRODUCT_TO_EXISTING_REF', addBackReference)
                    })
                }
              })
          } else {
            // add new reference and product to cart
            return dispatch('user/updateCartReferences', {
              customer_id: customerId,
              cart_reference: `${currentReferences},${reference}`,
              customer_token: customerToken
            }, { root: true })
              .then(() => {
                // Add new product to cart
                return api.cart.addToCart({
                  payload,
                  cart_reference: reference
                })
              })
              .then(res => {
                // Add products to Store
                const data = res.data.data

                data[0]['cart_reference'] = reference

                commit('SET_CART_ITEMS', data)
              })
          }
        }
      })

      // if (!currentReference) {
      //   // lets create a new reference for them
      //   return dispatch('user/updateCartReferences', {
      //     customer_id: customerId,
      //     cart_reference: reference,
      //     customer_token: customerToken
      //   }, { root: true })
      // } else {
      //   // there is a cart reference
      //   // if they already have a cartreference from the merchant
      //   console.log('currentReference', currentReference)
      //   _.map(currentReference.split(','), (ref) => {
      //     if (ref.includes(merchantName)) {
      //       console.log('ref', ref)
      //       // lets see if item already exists first
      //       return dispatch('fetchCartData', ref)
      //         .then(res => {
      //           console.log('lets see response', res.data.data)
      //         })
      //     }

      //     // Create a new instance of cart
      //     // return api.cart.addToCart({
      //     //   payload,
      //     //   cart_reference: reference
      //     // })
      //     //   .then(res => {
      //     //     console.log('cart res', res)
      //     //     const updateString = `${currentReference},${reference}`
      //     //     // ITEMS have been added to cart, now add cart reference to User data
      //     //     return dispatch('user/cartReference', {
      //     //       customer_id: customerId,
      //     //       cart_reference: updateString,
      //     //       customer_token: customerToken
      //     //     }, { root: true })
      //     //   })
      //   })
      // }
      // return dispatch('fetchCartData')
      //   .then(res => {
      //     console.log('our response', res)
      //     return api.cart.addToCart(payload)
      //   })
      //   .then(res => {
      //     console.log('cart', res.data.data)
      //     commit('SET_CART_ITEMS', res.data.data)
      //     return res.data
      //   })
      //   .catch(err => {
      //     return err
      //   })
  },

  deleteFromCart ({ state, commit, getters, rootGetters }, data) {
    const token = rootGetters['auth/token'] || rootGetters['anonAuth/token']

    return this.$axios.$delete(`${process.env.FB_URL}/cartSessions/${data.session_id}/products/${data.item.product_id}.json?auth=${token}`)
    //   .then(() => {
    //     const removeItem = _.pickBy(data, (key) => {
    //       console.log(key)
    //       return data.productId !== key.product_id
    //     })

    //     if (_.isEmpty(removeItem)) {
    //       return commit('SET_CART_ITEMS', null)
    //     }

    //     commit('SET_CART_ITEMS', removeItem)
    //   })
  },

  updateCartItemQuantity ({}, data) {
    return api.cart.updateCartItemQuantity(data)
  },

  fetchCartData ({ state, commit, rootGetters, dispatch }, cartReference) {
    console.log('cartreference monkey', cartReference)
    if (!cartReference) {
      console.log('no cart reference ')
      return dispatch('fetchCartReferences')
        .then(res => {
          if (!res) {
            return
          }

          const arrayOfReferences = res.split(',')
          let promises

          promises = arrayOfReferences.map(ref => {
            return api.cart.fetchCartData(ref)
              .then(res => {
                return {
                  res,
                  cart_reference: ref
                }
              })
          })

          return Promise.all(promises)
        })
        .then(res => {
          if (!res) {
            return
          }
          const newArray = []
          res.map((vendorCartCollection, index) => {
            let data = vendorCartCollection.res.data.data

            _.map(data, (item, i) => {
              data[i]['cart_reference'] = vendorCartCollection.cart_reference
            })

            newArray.push(data)
          })

          console.log('HERE', newArray)

          return {
            data: {
              data: newArray
            }
          }
        })
    }

    console.log('test')
    return api.cart.fetchCartData(cartReference)
    // .then(res => {
    //   console.log('res item', res)
    //   const data = res.data.data

    //   _.map(data, (item, i) => {
    //     data[i]['cart_reference'] = cartReference
    //   })

    //   commit('SET_CART_ITEMS', data)
    //   return res
    // })
    // const vm = this
    // let token
    // let uid
    // let promises
    // let isAuthenticated
    // let isAnonAuthenticated

    // if (req) {
    //   if (!req.headers.cookie) {
    //     // clear cart
    //     console.log('clear cart')
    //     commit('SET_CART_ITEMS', [])
    //     return
    //   }
    // }

    // function cartUidSession (token, cartId) {
    //   return vm.$axios.$get(`${process.env.FB_URL}/cartSessions/${cartId}/products/.json?auth=${token}`)
    //     .then((sessionData) => {
    //       return {
    //         session_data: sessionData,
    //         cart_id: cartId
    //       }
    //     })
    // }

    // function getCartId (token, uid) {
    //   return vm.$axios.$get(`${process.env.FB_URL}/users/${uid}/cart.json?auth=${token}`)
    // }

    // function getProductData (sessionData) {
    //   promises = []

    //   _.filter(sessionData.session_data, (key) => {
    //     promises.push(axios.get(`${process.env.FB_URL}/products/${key.product_id}.json`)
    //       .then((res) => {
    //         return {
    //           item: res.data,
    //           quantity: key.quantity,
    //           session_id: sessionData.cart_id
    //         }
    //       })
    //     )
    //   })

    //   // Add product data and quantity to cart items in state
    //   return axios.all(promises)
    //     .then((result) => {
    //       return result
    //     })
    //     .catch((err) => {
    //       console.log(err)
    //       throw err
    //     })
    // }

    // isAuthenticated = rootGetters['auth/isAuthenticated']
    // isAnonAuthenticated = rootGetters['anonAuth/isAuthenticated']
    // // User is ANON user
    // if (isAnonAuthenticated) {
    //   // Init anon auth first
    //   console.log('Init anon auth first')

    //   console.log('User is an ANON user')
    //   // Get ANONUID and see if there is a CART SESSION
    //   token = rootGetters['anonAuth/token']
    //   uid = rootGetters['anonAuth/uid']
    //   console.log('Get ANONUID and see if there is a cart session')
    //   console.log('token', token)
    //   return cartUidSession(token, uid)
    //     .then((sessionData) => {
    //       if (!sessionData) {
    //         // If there isnt a session lets just stop here
    //         console.log('If there isnt a session lets just stop here')
    //         return false
    //       }

    //       // There is a cart session, so lets get all the product ID'S
    //       console.log('There is a cart session, so lets get all the product IDs', sessionData)
    //       // Loop through Product IDs and get product data for each product ID
    //       return getProductData(sessionData)
    //     })
    //     .then((result) => {
    //       commit('SET_CART_ITEMS', result || [])
    //     })
    //     .catch((err) => {
    //       console.log(err.data)
    //       throw err
    //     })
    // }

    // console.log('FETCH CART DATA 2', isAuthenticated)
    // // User is Officially signed in
    // if (isAuthenticated) {
    //   console.log('User is Officially signed in')
    //   token = rootGetters['auth/token']
    //   uid = rootGetters['auth/uid']

    //   return getCartId(token, uid)
    //     .then((sessionId) => {
    //       if (!sessionId) {
    //         // If there isnt a session lets just stop here
    //         console.log('If there isnt any CartIDs lets just stop here')
    //         return false
    //       }

    //       // There are cart sessions, so lets get all the cart IDs
    //       console.log('There are cart sessions, so lets get all the cart IDs', sessionId)
    //       // There are cart sessions, so lets get all the cart IDs
    //       return cartUidSession(token, sessionId)
    //     })
    //     .then((sessionData) => {
    //       return getProductData(sessionData)
    //     })
    //     .then((result) => {
    //       commit('SET_CART_ITEMS', result)
    //     })
    //     .catch((err) => {
    //       console.log(err)
    //       throw err
    //     })
    // }
  },

  liveStock ({ commit }, payload) {
    const productId = payload.product_id

    return this.$axios.$get(`${process.env.FB_URL}/products/${productId}/stock.json`)
      .then((stock) => {
        return stock
      })
      .catch((err) => {
        throw err
      })
  }
}

const getters = {
  loadedCartItems (state) {
    return state.cartItems
  },

  cartTotalItems (state) {
    let newArray = []
    if (state.cartItems) {
      _.map(state.cartItems, items => {
        _.map(items, item => {
          newArray.push(item)
        })
      })

      const flatten = _.flatMap(newArray, flat => {
        return flat
      })

      const calculate = flatten.reduce((a, b) => {
        return {
          quantity: a.quantity + b.quantity
        }
      }, { quantity: 0 })

      return calculate.quantity
    }
    return 0
  },

  cartSubtotal (state) {
    if (state.cartItems) {
      const flatten = _.flattenDeep(state.cartItems)

      console.log('flatten', flatten)

      return flatten.reduce((a, b) => {
        return a + (b.quantity * b.unit_price.amount)
      }, 0)
    }
    return 0
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
