import Vue from 'vue'

Vue.filter('currency', (value) => {
  return value !== 0 ? `£${parseFloat(value).toFixed(2)}` : 'Free'
})
