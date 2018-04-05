import Cookie from 'js-cookie'
import _ from 'lodash'

const store = {
  namespaced: true,

  state: {
    userDetails: null
  },

  mutations: {
    SET_USER_DETAILS (state, userDetails) {
      state.userDetails = userDetails
    }
  },

  actions: {
    loadUser ({ commit, rootState }) {
      const token = rootState.auth.token

      return this.$axios.$get(`${process.env.BASE_URL}/users.json?auth=${token}`)
        .then(data => {
          return _.forOwn(data, (key, value) => {
            Cookie.set('user', key)
            localStorage.setItem('user', key)
            commit('SET_USER_DETAILS', key)
          })
        })
        .catch(err => err)
    }
  },

  getters: {
    userDetails (state) {
      return state.userDetails
    }
  }
}

export default store
