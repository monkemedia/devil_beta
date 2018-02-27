export default function(context) {
  if (context.store.getters['userItem/isError']) {
    context.redirect('/admin/add-product');
  }
}