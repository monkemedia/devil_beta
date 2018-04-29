import api from '~/api'

const state = () => ({
  data: null
})

const mutations = {
  SET_MOLTIN (store, data) {
    store.data = data
  }
}

const actions = {
  credentials ({ commit }) {
    const data = {
      client_id: 'HFjf7MrxTu3YpDwhhOO4p9he3bEN6sqFQKkBVccQsG',
      grant_type: 'implicit'
    }

    return api.moltin.credentials(data)
      .then(response => {
        commit('SET_MOLTIN', response.data)
      })
  }
}

const getters = {
  getCredentials (state) {
    return state.data
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
