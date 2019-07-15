<template>
  <div>
    admin
  </div>
</template>

<script>
  export default {
    name: 'Administrator',
    layout: 'dashboard',
    meta: { secure: true, admin: true },
    beforeCreate() {
      this.$store.dispatch('common/DO_SET_HEADER', 'administrator dashboard');
    }
  };
</script>

<style scoped>

</style>