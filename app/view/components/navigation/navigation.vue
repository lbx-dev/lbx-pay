<script>
  import { mapState, mapGetters } from 'vuex';
  import LanguagePicker from '../language-picker/language-picker';

  export default {
    name: 'Navigation',
    components: { LanguagePicker },
    data() {
      return {
        drawer: false
      };
    },
    computed: {
      ...mapState('common', {
        header: state => state.header
      }),
      ...mapGetters({
        isAdministrator: 'user/isAdministrator'
      })
    },
    mounted() {

    },
    methods: {
      navigate(where) {
        this.$router.push(this.localePath({ name: where }));
      },
      logout() {
        this.$store.dispatch('user/DO_LOGOUT');
        this.$router.push(this.localePath({ name: 'login' }));
      }
    }
  };
</script>
<template>
  <span class="atlas-navigation">
    <v-toolbar
      class="lbx-toolbar elevation-0"
      color="white"
      absolute>
      <v-toolbar-side-icon
        flat
        color="info"
        class="normal"
        @click.stop="drawer = true">
        <v-icon>menu</v-icon>
      </v-toolbar-side-icon>
      <v-toolbar-title>
        <span class="lbx-logo sm"></span>
      </v-toolbar-title>
      <v-toolbar-title>
        {{ header }}
      </v-toolbar-title>
      <v-spacer />
      <v-toolbar-items class="atlas-items">
        <language-picker />
      </v-toolbar-items>
    </v-toolbar>
    <v-navigation-drawer
      v-model="drawer"
      temporary
      fixed>
      <v-layout
        column
        fill-height>
        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-content>
              <v-list-tile-title>
                <span class="text-l-center lbx-logo"></span>
              </v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action class="ma-3">
              <v-btn
                class="gray--text"
                icon
                @click.stop="drawer = false">
                <v-icon>chevron_left</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
        <v-list
          class="pt-0"
          dense>
          <v-divider />

        </v-list>
        <v-spacer />
        <v-list
          class="pt-0"
          dense>
          <v-list-tile @click="logout">
            <v-list-tile-action>
              <v-icon>exit_to_app</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>logout</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-layout>
    </v-navigation-drawer>
  </span>
</template>
<style scoped>
  .atlas-items {
    padding-top: 20px;
  }

  .lbx-toolbar {
    box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.05), 0 5px 8px 0px rgba(0, 0, 0, 0.05), 0 1px 14px 0px rgba(0, 0, 0, 0.05) !important;
  }

  .lbx-toolbar > div {
    margin-left: 0 !important;
  }
</style>