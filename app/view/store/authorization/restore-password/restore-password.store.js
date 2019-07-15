export default {
  namespaced: true,
  actions: {
    SHOULD_REDIRECT() {
      const restorationToken = arguments[1];
      const { get } = this.$axios;

      return get(`/api/restore-password/${restorationToken}/check`);
    },
    DO_RESTORE_PASSWORD() {
      const body = arguments[1];

      const { post } = this.$axios;

      return post('/api/restore-password', body);
    }
  }
};