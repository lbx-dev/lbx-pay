<template>
  <v-flex
    class="ma-2"
    lg3
    md5
    sm12>
    <v-card class="atlas-widget">
      <v-card-title primary-title>
        <div class="headline">
          Submitted documents
        </div>
      </v-card-title>
      <v-divider />
      <v-card-text>
        docs for {{ id }}
        <v-dialog
          v-model="dialog"
          width="600px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary"
                   dark
                   v-on="on">
              Open Dialog
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">Use Google's location service?</span>
            </v-card-title>
            <v-card-text>
              test
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-card-text>
    </v-card>
  </v-flex>
</template>

<script>
  export default {
    name: 'DocumentsWidget',
    props: {
      id: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        dialog: false
      };
    },
    computed: {},
    methods: {}

  };
</script>

<style scoped>

</style>