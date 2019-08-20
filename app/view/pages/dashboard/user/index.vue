<template>
  <v-layout column>
    <v-dialog
      v-model="dialog"
      width="500">
      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title>
          Deposit Bitcoin
        </v-card-title>
        <v-card-text>
          Choose bond option
        </v-card-text>
        <v-container
          grid-list-md
          text-xs-center>
          <v-layout
            row
            wrap>
            <v-tooltip
              v-for="bond in growthBonds"
              :key="bond.id"
              bottom>
              <template v-slot:activator="{ on }">
                <v-flex
                  xs6
                  v-on="on">
                  <v-card
                    :class="{ selected: bond.id === selectedBond, 'bond-option': true}"
                    @click="selectedBond = bond.id">
                    <v-card-text>{{ bond.name }}</v-card-text>
                  </v-card>
                </v-flex>
              </template>
              <div style="color:white">
                <ul>
                  <li> Duration: {{ bond.duration }} months</li>
                  <li> Monthly growth: {{ bond.monthlyGrowth }}%</li>
                  <li> Annual growth: {{ bond.annualGrowth }}%</li>
                  <li> Total growth: x{{ bond.totalGrowth }}</li>
                </ul>
              </div>
            </v-tooltip>
          </v-layout>
        </v-container>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="black"
            flat
            @click="dialog = false">
            Cancel
          </v-btn>
          <v-btn
            color="black"
            :disabled="preventSubmission"
            @click="depositBTC">
            <v-progress-circular
              v-if="depositing"
              :indeterminate="true" />
            <span v-else>
              Confirm
            </span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div class="display-1 lbx-partner-title">
      Wallets
    </div>
    <v-layout
      d-flex>
      <v-layout
        align-start
        justify-start
        row
        wrap>
        <v-card
          class="mx-auto">
          <v-card-title style="font-weight: 500">
            BTC
          </v-card-title>

          <v-list class="transparent">
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title> Address </v-list-tile-title>
                <v-list-tile-sub-title> {{ address }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider />
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title> Available balance </v-list-tile-title>
                <v-list-tile-sub-title> {{ availableBalance }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider />
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title> Pending balance </v-list-tile-title>
                <v-list-tile-sub-title> {{ pendingBalance ? pendingBalance : '-' }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider />
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title> QR </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <canvas class="lbx-qr-code"></canvas>
          </v-list>
          <v-card-actions>
            <v-btn
              color="black"
              @click="dialog = true"
              text>
              Deposit
            </v-btn>
            <v-btn
              flat
              color="black">
              Withdraw
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-layout>
    </v-layout>
  </v-layout>
</template>

<script>
  import { mapState } from 'vuex';
  import QRCode from 'qrcode';

  export default {
    name: 'User',
    layout: 'dashboard',
    meta: { secure: true, partner: false },
    nuxtI18n: {
      paths: {
        us: '/wallet',
        rs: '/novcanik'
      }
    },
    data() {
      return {
        dialog: false,
        selectedBond: '',
        depositing: false
      };
    },
    computed: {
      ...mapState({
        address: state => state.pay.address,
        pendingBalance: state => state.pay.pendingBalance,
        availableBalance: state => state.pay.availableBalance,
        growthBonds: state => state.pay.growthBonds
      }),
      preventSubmission() { return !this.selectedBond; }
    },
    async beforeCreate() {
      await this.$store.dispatch('pay/DO_GET_BALANCE');
      this.$store.dispatch('pay/DO_GET_GROWTH_BONDS');
    },
    mounted() {
      QRCode.toCanvas(document.querySelector('.lbx-qr-code'), this.address);
    },
    updated() {
      QRCode.toCanvas(document.querySelector('.lbx-qr-code'), this.address);
    },
    methods: {
      async depositBTC() {
        this.depositing = true;
        await this.$store.dispatch('pay/DO_DEPOSIT', { bondId: this.selectedBond });
        this.depositing = false;
        this.dialog = false;
      }
    }
  };
</script>

<style scoped>
  .bond-option { cursor: pointer; }
  .selected {
    box-shadow: 0 0 3px #cb1d36;
  }
</style>