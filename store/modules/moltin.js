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
    console.log('client_id', process.env.MOLTIN_CLIENT_ID)
    console.log('secret', process.env.MOLTIN_CLIENT_SECRET)
    const data = {
      client_id: process.env.MOLTIN_CLIENT_ID,
      client_secret: process.env.MOLTIN_CLIENT_SECRET,
      grant_type: 'client_credentials'
    }

    return api.moltin.credentials(data)
      .then(response => {
        console.log('seller credentials', response)
        commit('SET_MOLTIN', response.data)
      })
      .catch(err => {
        console.log('ERROR', err)
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
