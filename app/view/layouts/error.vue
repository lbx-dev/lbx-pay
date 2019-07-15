<template>
  <div class="container">
    <h1 v-if="error.statusCode === 404">
      Page not found
    </h1>
    <h1 v-else>
      An error occurred
    </h1>
    <div>
      {{ error }}
    </div>

    <nuxt-link to="/">
      Home page
    </nuxt-link>
  </div>
</template>

<script>
  export default {
    props: {
      error: {
        type: Object,
        default: () => ({ message: 'Unknown error happened' })
      }
    }//,

    //layout: 'blog' // you can set a custom layout for the error page
  };
</script>

<style scoped>

</style>