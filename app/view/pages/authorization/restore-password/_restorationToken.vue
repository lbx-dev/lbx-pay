<template>
  <div>
    <v-card-text>
      <v-form @keyup.enter.native="restorePassword">
        <v-text-field
          v-model="password"
          type="password"
          :label="$t('restorePassword.PASSWORD_LABEL')"
          required />
        <v-text-field
          v-model="repeatPassword"
          type="password"
          :rules="repeatPasswordRules"
          :label="$t('restorePassword.REPEAT_PASSWORD_LABEL')"
          required />
        <div
          v-if="loading"
          class="text-xs-center info--text">
          <v-progress-circular :indeterminate="true" />
        </div>
        <div
          v-if="message"
          :class="messageClass">
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
        {{ $t('restorePassword.LOGIN_BUTTON') }}
      </v-btn>
      <v-btn
        color="info"
        :disabled="preventSubmission"
        @click="restorePassword">
        {{ $t('restorePassword.RESTORE_PASSWORD_BUTTON') }}
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
  export default {
    name: 'RestorePassword',
    meta: { secure: false },
    layout: 'access',
    nuxtI18n: {
      paths: {
        us: '/restore-password/:restorationToken',
        rs: '/vracanje-lozinke/:restorationToken'
      }
    },
    head() {
      return this.$getPageName(this.$t('restorePassword.TITLE'));
    },
    data() {
      const { repeatPasswordRules } = this.$formValidators();

      return {
        error: false,
        password: '',
        repeatPassword: '',
        repeatPasswordRules,
        loading: false,
        message: ''
      };
    },
    computed: {
      preventSubmission() {
        return !(
          this.password &&
          this.password === this.repeatPassword
        );
      },
      messageClass() {
        const classes = [ 'text-xs-center', 'font-weight-bold', 'title' ];

        if(this.error) {
          classes.push('error--text');
        } else {
          classes.push('info--text');
        }
        return classes.join(' ');
      }
    },
    async asyncData({ app, store, redirect, params }) {
      store.dispatch('common/DO_SET_HEADER', store.state.i18n.messages.restorePassword.HEAD);

      try {
        await store.dispatch('restorePassword/SHOULD_REDIRECT', params.restorationToken);
      } catch(error) {
        redirect(app.localePath({ name: 'login' }));
      }
      return {
        error: false,
        password: '',
        repeatPassword: '',
        repeatPasswordRules: [],
        loading: false,
        message: ''
      };
    },
    methods: {
      navigateToLogin() {
        this.$router.push(this.localePath({ name: 'login' }));
      },
      reset() {
        this.error = false;
        this.loading = false;
        this.message = '';
      },
      async restorePassword() {
        this.loading = true;
        let response;

        try {
          response = await this.$store.dispatch('restorePassword/DO_RESTORE_PASSWORD', {
            password: this.password,
            restorationToken: this.$route.params.restorationToken
          });
          setTimeout(this.navigateToLogin, 1500);
        } catch(error) {
          this.error = true;
          response = error.response;
        }

        this.loading = false;
        this.message = response.data;

        setTimeout(this.reset, 1500);
      }
    }
  };
</script>

<style scoped>

</style>