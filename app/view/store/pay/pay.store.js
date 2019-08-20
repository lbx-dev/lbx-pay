export default {
  namespaced: true,
  state() {
    return {
      address: '',
      availableBalance: '',
      pendingBalance: '',
      growthBonds: []
    };
  },
  mutations: {
    SET_BALANCES(state, { availableBalance, pendingReceivedBalance }) {
      state.availableBalance = availableBalance;
      state.pendingBalance = pendingReceivedBalance;
    },
    SET_ADDRESS(state, { address }) {
      state.address = address;
    },
    SET_GROWTH_BONDS(state, { growthBonds }) {
      state.growthBonds = growthBonds;
    }
  },
  getters: {
    getAddress(state) {
      return state.address;
    },
    getAvailableBalance(state) {
      return state.availableBalance;
    },
    getPendingBalance(state) {
      return state.pendingBalance;
    },
    getGrowthBonds(state) {
      return state.growthBonds;
    }
  },
  actions: {
    async DO_GET_BALANCE({ commit }) {
      const { get } = this.$axios;

      const { data } = await get('/api/pay/balance');

      const { balance } = data;

      commit('SET_BALANCES', balance);
      commit('SET_ADDRESS', { address: balance.balances[0].address });
    },

    async DO_GET_GROWTH_BONDS({ commit }) {
      const { get } = this.$axios;

      const { data } = await get('/api/pay/growth-bonds');

      commit('SET_GROWTH_BONDS', data);
    },
    async DO_DEPOSIT({ dispatch }, { bondId }) {
      const { post } = this.$axios;

      await post('/api/pay/deposit', { bondId });
      await dispatch('DO_GET_BALANCE');
    }
  }

};