export default function (context) {
  console.log('monkey')
  if (!context.store.getters['auth/isAuthenticated']) {
    context.redirect('/sign-in');
  }
}