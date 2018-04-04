export default function (context) {
  context.store.dispatch('anonAuth/initAuth', context.req)
}