import Vue from 'vue'

Vue.mixin({
  methods: {
    alertToast (data) {
      setTimeout(() => {
        this.$toast.open({
          message: data.message,
          duration: 2000,
          type: data.type
        })
      }, 400)
    }
  }
})
