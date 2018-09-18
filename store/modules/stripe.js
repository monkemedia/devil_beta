import api from '~/api'

const state = () => ({
  account: null
})

const mutations = {
  SET_ACCOUNT (state, account) {
    state.account = account
  }
}

const actions = {
  createAccount ({ commit }, data) {
    return api.stripe.createAccount(data)
      .then(res => {
        commit('SET_ACCOUNT', res.data)
        return res
      })
      .catch(err => {
        throw err
      })
  },

  fetchAccount ({ commit }, accountId) {
    return api.stripe.fetchAccount(accountId)
      .then(res => {
        commit('SET_ACCOUNT', res.data)
        return res
      })
      .catch(err => {
        throw err.message
      })
  }
}

const getters = {
  loadedAccount (state) {
    return state.account
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
