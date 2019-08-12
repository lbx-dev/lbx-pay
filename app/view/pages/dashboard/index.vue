<template>
  <br />
</template>

<script>
  export default {
    name: 'Dashboard',
    meta: { secure: true },
    nuxtI18n: {
      paths: {
        en: '/us/dashboard',
        rs: '/rs/dashboard'
      }
    },
    created() {
      const user = this.$store.getters['user/getUser'];
      const rolesObject = this.$store.getters['common/getRolesObject'];

      if(rolesObject.ADMINISTRATOR === user.role.id) {
        return this.$router.replace(this.localePath({ name: 'administrator' }));
      }
      return this.$router.replace(this.localePath({ name: 'user' }));
    }
  };
</script>

<style scoped>

</style>