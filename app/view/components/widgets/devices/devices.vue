<template>
  <v-flex
    class="ma-2"
    lg3
    md5
    sm12>
    <v-card class="atlas-widget">
      <v-card-title primary-title>
        <div class="headline">
          {{ $t('widgets.DEVICES_HEAD') }}
          <span v-if="total > 0">
            ({{ `${total} ${$t('widgets.DEVICES_TOTAL')}` }})
          </span>
        </div>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <div
          v-if="total > 0"
          class="atlas-graph-container">
          <div class="atlas-graph-legend">
            <p class="inactive">
              {{ `${$t('widgets.DEVICES_INACTIVE_LABEL')} ${inactive}` }}
            </p>
            <p class="active">
              {{ `${$t('widgets.DEVICES_ACTIVE_LABEL')} ${active}` }}
            </p>
          </div>
          <canvas
            class="atlas-graph"></canvas>
        </div>
        <div
          v-else
          class="headline font-italic atlas-widget-no-devices">
          {{ $t('widgets.NO_DEVICES_FOUND') }}
        </div>
      </v-card-text>
    </v-card>
  </v-flex>
</template>

<script>
  import Chart from 'chart.js';

  export default {
    name: 'DeviceWidget',
    props: {
      active: {
        type: Number,
        default: 0
      },
      inactive: {
        type: Number,
        default: 0
      }
    },
    computed: {
      total() {
        return this.active + this.inactive;
      }
    },
    mounted() {
      if(this.total > 0) {
        this.loadChart();
      }
    },
    methods: {
      loadChart() {
        // eslint-disable-next-line no-new
        new Chart(this.$el.querySelector('.atlas-graph'), {
          type: 'pie',
          data: {
            labels: [ 'INACTIVE', 'ACTIVE' ],
            datasets: [ {
              label: 'Devices',
              data: [ this.inactive, this.active ],
              backgroundColor: [
                'rgba(255, 82, 82, 0.7)',
                'rgba(54, 162, 235, 0.7)'
              ],
              borderColor: [
                'rgba(255, 82, 82, 1)',
                'rgba(54, 162, 235, 1)'
              ],
              borderWidth: 1
            } ]
          },
          options: {
            cutoutPercentage: 70,
            responsive: false,
            animation: false,
            legend: {
              display: false
            }

          }
        });
      }
    }

  };
</script>


<style scoped>

</style>