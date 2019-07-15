export default {
  namespaced: true,
  actions: {
    async DO_REGISTER() {
      const user = arguments[1];
      const { post } = this.$axios;

      return post('/api/registration', user);
    },
    DO_CONFIRM_REGISTRATION() {
      const { confirmationToken } = arguments[1];

      const { post } = this.$axios;

      return post('/api/confirm', { confirmationToken });
    }
  }
};