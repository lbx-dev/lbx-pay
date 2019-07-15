export default {
  namespaced: true,
  state() {
    return {
      RANDOM_SECURITY: '',
      header: '',
      rolesObject: {},
      roles: []
    };
  },
  mutations: {
    SET_ROLES(state, { roles, rolesObject }) {
      state.roles = roles;
      state.rolesObject = rolesObject;
    },
    SET_HEADER(state, header) {
      state.header = header;
    },
    SET_RANDOM_SECURITY(state, security) {
      state.RANDOM_SECURITY = security;
    }
  },
  getters: {
    getRolesObject(state) {
      return state.rolesObject;
    },
    getRoles(state) {
      return state.roles;
    },
    getHeader(state) {
      return state.header;
    },
    getRandomSecurity(state) {
      return state.RANDOM_SECURITY;
    }
  },
  actions: {
    async DO_SET_ROLES({ commit }) {
      const { get } = this.$axios;
      const rolesObject = { NOT_LOGGED_IN: -1 };
      const { RANDOM_SECURITY } = process.env;

      const { data } = await get('/api/roles', { headers: { 'ks-security': RANDOM_SECURITY } });
      data.roles.forEach(function (role) {
        rolesObject[role.name.toUpperCase()] = role.id;
      });

      commit('SET_ROLES', { roles: data.roles, rolesObject } );
    },

    DO_SET_HEADER({ commit }, header) {
      commit('SET_HEADER', header);
    }
  }
};