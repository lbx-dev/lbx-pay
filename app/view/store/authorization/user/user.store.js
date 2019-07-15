import Cookies from 'js-cookie';

export default {
  namespaced: true,
  state() {
    return {
      user: {
        token: '',
        id: '',
        role: { id: -1, name: '' },
        firstName: '',
        lastName: '',
        email: ''
      }
    };
  },
  mutations: {
    LOGIN(state, user) {
      state.user = user;
    },
    LOGOUT(state) {
      state.user = {
        token: '',
        id: '',
        role: { id: -1, name: '' },
        firstName: '',
        lastName: '',
        email: ''
      };
    }
  },
  getters: {
    getUser(state) {
      return state.user;
    },
    isLoggedIn(state) {
      return (state.user.role.id !== -1);
    },
    isAdministrator(state) {
      return (state.user.role.name === 'administrator');
    },
    getRole(state) {
      return state.role;
    }
  },
  actions: {
    async DO_LOGIN({ commit }, { secret }) {
      const { post } = this.$axios;

      const { data } = await post('/api/login', secret);
      Cookies.set('ks-security', data['ks-security'], { path: '/' });

      commit('LOGIN', data.user);
    },
    async DO_LOGOUT({ commit }) {
      Cookies.remove('ks-security', { path: '/' });

      commit('LOGOUT');
    },
    async DO_FACEBOOK_LOGIN({ commit }, { secret }) {
      const { post } = this.$axios;

      const { data } = await post('/api/login/facebook', secret);
      Cookies.set('ks-security', data['ks-security'], { path: '/' });

      commit('LOGIN', data.user);
    }
  }
};