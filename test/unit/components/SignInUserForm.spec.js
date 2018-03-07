import { shallow, mount, createLocalVue } from 'vue-test-utils'
import flushPromises from 'flush-promises'
import SignInUserForm from '@/components/SignInUserForm.vue'
import VeeValidate from 'vee-validate'

const localVue = createLocalVue()
let wrapper

localVue.use(VeeValidate)
wrapper = shallow(SignInUserForm, { localVue })

describe('Sign in Component', () => {
  it('should render without throwing an error', () => {
    expect(wrapper.contains('form')).toBe(true)
  })

  it('renders a email input', () => {
    expect(wrapper.contains('#email')).toBe(true)
  })

  it('renders a password input', () => {
    expect(wrapper.contains('#password')).toBe(true)
  })
})

describe('Email input', () => {
  it('email field is required', async () => {
    const input = wrapper.find('#email')

    wrapper.setData({
      email: ''
    })

    wrapper.vm.$validator.validate('email')
    await flushPromises()
    expect(wrapper.vm.errors.has('email')).toBe(true)
  })

  it('email field should be filled correctly', async () => {
    const input = wrapper.find('#email')

    wrapper.setData({
      email: 'not-email-address'
    })

    wrapper.vm.$validator.validate('email')
    await flushPromises()
    expect(wrapper.vm.errors.has('email')).toBe(true)
  })

  it('email error should show', async () => {
    const input = wrapper.find('#email')

    wrapper.setData({
      email: 'not-email-address'
    })

    wrapper.vm.$validator.validate('email')
    await flushPromises()
    expect(input.contains('.is-danger')).toBe(true)
  })
})

describe('Password input', () => {
  it('password field is required', async () => {
    const input = wrapper.find('#email')

    wrapper.setData({
      password: ''
    })

    wrapper.vm.$validator.validate('password')
    await flushPromises()
    expect(wrapper.vm.errors.has('password')).toBe(true)
  })


  it('password error should show if left blank', async () => {
    const input = wrapper.find('#password')

    wrapper.setData({
      password: ''
    })

    wrapper.vm.$validator.validate('password')
    await flushPromises()
    expect(input.contains('.is-danger')).toBe(true)
  })
})
