<template>
  <div>
    <v-card-text>
      <v-form @keyup.enter.native="forgotPassword">
        <v-text-field
          v-model="email"
          :rules="emailRules"
          :label="$t('login.EMAIL_LABEL')"
          validate-on-blur
          required />
        <div
          v-if="loading"
          class="text-xs-center info--text">
          <v-progress-circular :indeterminate="true" />
        </div>
        <div
          v-if="message"
          class="text-xs-center font-weight-bold title error--text">
          {{ message }}
        </div>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        color="black"
        flat
        @click="navigateToLogin">
        {{ $t('forgotPassword.LOGIN_BUTTON') }}
      </v-btn>
      <v-btn
        color="info"
        :disabled="preventSubmission"
        @click="forgotPassword">
        {{ $t('forgotPassword.SEND_EMAIL_BUTTON') }}
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
  export default {
    name: 'ForgotPassword',
    meta: { secure: false },
    layout: 'access',
    nuxtI18n: {
      paths: {
        rs: '/zaboravljena-lozinka',
        us: '/forgot-password'
      }
    },
    head () {
      return this.$getPageName(this.$t('forgotPassword.TITLE'));
    },
    data () {
      return {
        email: '',
        message: '',
        loading: false
      };
    },
    computed: {
      preventSubmission () {
        const { isEmailValid } = this.$formValidators();
        return !(
          this.email &&
          isEmailValid(this.email)
        );
      },
      emailRules() {
        return this.$formValidators().emailRules;
      }
    },
    asyncData({ store }) {
      store.dispatch('common/DO_SET_HEADER', store.state.i18n.messages.forgotPassword.TITLE);

      return {
        email: '',
        message: '',
        loading: false
      };
    },
    methods: {
      reset () {
        this.loading = false;
        this.message = '';
      },
      async forgotPassword () {
        this.loading = true;
        try {
          await this.$store.dispatch('forgotPassword/DO_REQUEST_RESTORATION', { email: this.email });

          this.loading = false;

          this.navigateToLogin();
        } catch ({ response }) {
          this.loading = false;
          this.message = response.data;
          setTimeout(this.reset, 1500);
        }
      },
      navigateToLogin () {
        this.$router.push(this.localePath({ name: 'login' }));
      }
    }
  };
</script>

<style scoped>

</style>