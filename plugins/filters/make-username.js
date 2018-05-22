import Vue from 'vue'

Vue.filter('makeUsername', (value) => {
  console.log('value', value)
  if (!value) {
    return
  }

  const createArray = value.split('_VENDOR')
  return createArray[0]
})
