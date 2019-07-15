<style scoped>
  .atlas-app {
    background-color: #fafafa !important;
  }

  .atlas-content-layout {
    padding-top: 64px;
  }
</style>

<script>
  import { mapState } from 'vuex';
  import Navigation from '../components/navigation/navigation';

  export default {
    name: 'Default',
    components: {
      Navigation
    },
    computed: {
      ...mapState('user', {
        user: state => state.user
      })
    }
  };
</script>

<template>
  <v-app class="atlas-app">
    <v-container fluid>
      <Navigation :user="user" />
      <v-layout
        class="atlas-content-layout"
        justify-content
        column
        fill-height>
        <nuxt />
      </v-layout>
    </v-container>
  </v-app>
</template>