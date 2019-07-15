<style scoped>
</style>
<script>
  export default {
    name: 'Index',
    head() {
      return this.$getPageName(this.$t('index.TITLE'));
    },
    layout: 'index',
    nuxtI18n: {
      paths: {
        en: '/',
        rs: '/'
      }
    },
    created() {
      return this.$router.replace(this.localePath({ name: 'login' }));
    }
  };
</script>

<template>
  <br />
</template>

