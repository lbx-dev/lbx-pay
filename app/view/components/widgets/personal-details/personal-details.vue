<template>
  <v-flex
    class="ma-2"
    lg3
    md5
    sm12>
    <v-card class="atlas-widget">
      <v-card-title primary-title>
        <div class="headline">
          {{ $t('widgets.PERSONAL_DETAILS_HEAD') }}
        </div>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-list two-line>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-list-tile
                @click="() => {}"
                v-on="on">
                <v-list-tile-action>
                  <v-icon color="indigo">
                    people
                  </v-icon>
                </v-list-tile-action>

                <v-list-tile-content>
                  <v-list-tile-title>
                    {{ name }}
                  </v-list-tile-title>
                  <v-list-tile-sub-title> {{ $t('widgets.PERSONAL_DETAILS_NAME') }} </v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>

            <span style="color: white; overflow-wrap: break-word;">{{ name }} </span>
          </v-tooltip>
          <v-divider />
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-list-tile
                @click="() => {}"
                v-on="on">
                <v-list-tile-action>
                  <v-icon color="indigo">
                    phone
                  </v-icon>
                </v-list-tile-action>

                <v-list-tile-content>
                  <v-list-tile-title>
                    {{ address }}
                  </v-list-tile-title>
                  <v-list-tile-sub-title> {{ $t('widgets.PERSONAL_DETAILS_ADDRESS') }} </v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
            <span style="color: white">{{ address }} </span>
          </v-tooltip>
          <v-divider />
          <v-list-tile
            @click="() => {}">
            <v-list-tile-action>
              <v-icon
                v-if="isPerson"
                color="indigo">
                person
              </v-icon>
              <v-icon
                v-else
                color="indigo">
                business
              </v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>
                {{ $t(type) }}
              </v-list-tile-title>
              <v-list-tile-sub-title> {{ $t('widgets.PERSONAL_DETAILS_TYPE') }} </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider />
          <v-list-tile
            @click="() => {}">
            <v-list-tile-action>
              <v-icon
                color="indigo">
                ballot
              </v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>
                {{ identification }}
              </v-list-tile-title>
              <v-list-tile-sub-title> {{ $t('widgets.PERSONAL_DETAILS_IDENTIFICATION') }} </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card-text>
    </v-card>
  </v-flex>
</template>

<script>
  export default {
    name: 'DeviceWidget',
    props: {
      name: {
        type: String,
        default: ''
      },
      address: {
        type: String,
        default: ''
      },
      isPerson: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        default: ''
      },
      identification: {
        type: String,
        default: ''
      }
    },
    computed: {},
    methods: {}

  };
</script>

<style scoped>

</style>