<script>
  import { mapState } from 'vuex';
  import LanguagePicker from '../components/language-picker/language-picker.vue';

  export default {
    name: 'Access',
    components: { LanguagePicker },
    computed: {
      ...mapState('common', {
        header: state => state.header
      })
    }
  };
</script>

<style scoped> </style>

<template>
  <v-app>
    <div class="lbx-gradient-decoration"></div>
    <v-toolbar
      class="lbx-toolbar transparent landing"

      color="elevation-0">
      <v-toolbar-title>
        <nuxt-link
          class="lbx-logo atlas-headline"
          :to="localePath('index')" />
      </v-toolbar-title>
    </v-toolbar>
    <v-container>
      <v-layout
        align-center
        justify-center
        row
        fill-height>
        <v-flex
          xs12
          sm6>
          <v-card>
            <v-card-title primary-title>
              <h3 class="headline font-weight-regular info--text">
                {{ header }}
              </h3>
              <v-spacer />
              <language-picker class="access" />
            </v-card-title>
            <v-card-text class="text-xs-center lbx-logo" />
            <transition name="fade">
              <nuxt />
            </transition>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>