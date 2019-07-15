import Cookies from 'js-cookie';

export default function ({ store }) {
  if(!store.getters['user/isLoggedIn']) {
    Cookies.remove('ks-security', { path: '/' });
  }
}