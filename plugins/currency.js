import Vue from 'vue'

Vue.filter('currency', (value, currency) => {
  let symbol

  switch (currency) {
  case 'GBP':
    symbol = '£'
    break
  case 'USD':
    symbol = '$'
    break
  }

  return value !== 0 ? symbol + parseFloat(value).toFixed(2) : 'Free'
})
