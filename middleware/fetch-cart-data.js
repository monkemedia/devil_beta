export default function (context) {
  context.store.dispatch('cart/fetchCartData', context.req)
}