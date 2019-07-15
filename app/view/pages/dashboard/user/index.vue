<template>
  <div>
    user
  </div>
</template>

<script>
  export default {
    name: 'User',
    layout: 'dashboard',
    meta: { secure: true, partner: false },
    beforeCreate() {
      this.$store.dispatch('common/DO_SET_HEADER', 'user dashboard');
    }
  };
</script>

<style scoped>

</style>