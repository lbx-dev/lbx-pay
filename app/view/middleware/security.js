export default async function ({ store, req }) {

  if (!process.server && !req) {
    return;
  }

  const loggedUser = req.headers.security;
  if(loggedUser.role.id === store.getters['common/getRolesObject'].NOT_LOGGED_IN) {
    store.dispatch('user/DO_LOGOUT');
  } else {
    store.commit('user/LOGIN', loggedUser);
  }

}
