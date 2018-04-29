import api from '~/api'

const moltin = {
  namespaced: true,

  state: {
    data: null
  },

  mutations: {
    SET_MOLTIN (store, data) {
      store.data = data
    }
  },

  actions: {
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
  },

  getters: {
    getCredentials (state) {
      return state.data
    }
  }
}

export default moltin
