export default function (context) {
  context.store.dispatch('cart/initCart', context.req)
}
