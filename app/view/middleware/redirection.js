export default function({ store, route, req, redirect, app, next }) {
  let roleId;
  const rolesObject = store.getters['common/getRolesObject'];

  function resolveRoleId() {
    if(process.server) {
      const { security } = req.headers;
      roleId = security.role.id;
    }
    roleId = store.getters['user/getUser'].role.id;
  }
  function isRouteAccess() {
    return (
      route.name && (
        route.name.startsWith('login') ||
        route.name.startsWith('confirm-id') ||
        route.name.startsWith('registration') ||
        route.name.startsWith('forgot-password')
      )
    );
  }
  function isRouteSecure() {
    return (
      route.name && route.meta[0].secure
    );
  }
  function isRouteDashboard() {
    return (
      route.name && route.name.startsWith('dashboard') );
  }
  function isRouteAdmin() {
    return ( route.name && route.meta[0].admin );
  }
  function isAdministrator() {
    return (rolesObject.ADMINISTRATOR === roleId);
  }

  function securityRedirection() {

    if(route.fullPath === '/') {
      return redirect(app.localePath({ name: 'index' }));
    }

    const isLoggedIn = store.getters['user/isLoggedIn'];
    const isAccessRoute = isRouteAccess(route);
    const isSecureRoute = isRouteSecure(route);
    if(!isSecureRoute && !isAccessRoute) {
      return;
    }
    const isAdmin = isAdministrator();
    const isAdminRoute = isRouteAdmin();

    if(isAccessRoute && isLoggedIn) {
      return redirect(app.localePath({ name: 'dashboard' }));
    }
    if(isSecureRoute && !isLoggedIn) {
      return redirect(app.localePath({ name: 'login' }));
    }

    if(isRouteDashboard()) {
      if(isAdmin) {
        return redirect(app.localePath({ name: 'administrator' }));
      }
      return redirect(app.localePath({ name: 'user' }));
    }
    if(isAdminRoute && !isAdmin) {
      return redirect(app.localePath({ name: 'user' }));
    }

    if(!isAdminRoute && isAdmin) {
      return redirect(app.localePath({ name: 'administrator' }));
    }
  }
  function languageSwitchRedirection() {
    if(!route.name) {
      return;
    }

    const selected = store.getters['languages/getSelected'];
    const originalName = route.name.split('___')[0];
    const newName = originalName + '___' + selected;

    if(route.name !== newName) {
      redirect({
        name: newName,
        params: route.params,
        query: route.query,
        meta: route.meta
      });
    }
  }

  resolveRoleId();
  languageSwitchRedirection();
  securityRedirection();

}