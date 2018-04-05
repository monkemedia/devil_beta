import Vue from 'vue'

Vue.filter('currency', value => `£${parseFloat(value).toFixed(2)}`)
