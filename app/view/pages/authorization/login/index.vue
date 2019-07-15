<style scoped>

</style>
<script>

  export default {
    name: 'Login',
    layout: 'access',
    nuxtI18n: {
      paths: {
        us: '/login',
        rs: '/uloguj-se'
      }
    },
    head() {
      return this.$getPageName(this.$t('login.TITLE'));
    },
    data() {
      return {
        email: '',
        password: '',
        message: '',
        loading: false,
        loginFailed: false
      };
    },
    computed: {
      preventSubmission() {
        const { isEmailValid } = this.$formValidators();
        return !(
          this.email &&
          isEmailValid(this.email) &&
          this.password
        );
      },
      emailRules() {
        return this.$formValidators().emailRules;
      }
    },
    asyncData({ store }) {
      store.dispatch('common/DO_SET_HEADER', store.state.i18n.messages.login.HEAD);

      return {
        email: '',
        password: '',
        message: '',
        loading: false,
        loginFailed: false
      };
    },
    methods: {
      navigateToRegistration() {
        this.$router.push(this.localePath({ name: 'registration' }));
      },
      navigagteToForgotPassword() {
        this.$router.push(this.localePath({ name: 'forgot-password' }));
      },
      reset() {
        this.loading = false;
        this.message = '';
      },
      async fbLoginCallback({ authResponse }) {
        try {
          await this.$store.dispatch('user/DO_FACEBOOK_LOGIN', {
            secret: {
              accessToken: authResponse.accessToken
            }
          });

          this.loading = false;

          this.$router.push(this.localePath({ name: 'dashboard' }));
        } catch(error) {
          this.loading = false;
          this.message = error.response.data;
          setTimeout(this.reset, 1500);
        }
      },
      facebookLogin() {
        FB.getLoginStatus((authResponse) => {
          if(!authResponse) {
            FB.login(this.fbLoginCallback, { scope: 'public_profile,email' });
          } else {
            this.fbLoginCallback(authResponse);
          }
        });
      },
      async login() {
        if(this.preventSubmission) {
          return;
        }
        this.loading = true;
        try {
          await this.$store.dispatch('user/DO_LOGIN', {
            secret: {
              email: this.email,
              password: this.password
            }
          });

          this.loading = false;

          console.log(this.localePath({ name: 'dashboard' }));
          this.$router.push(this.localePath({ name: 'dashboard' }));
        } catch(error) {
          this.loading = false;
          this.message = error.response.data;
          this.loginFailed = true;
          setTimeout(this.reset, 1500);
        }

      }
    }
  };
</script>
<template>
  <div>
    <v-card-text>
      <v-form @keyup.enter.native="login">
        <v-text-field
          v-model="email"
          :rules="emailRules"
          :label="$t('login.EMAIL_LABEL')"
          validate-on-blur
          required />
        <v-text-field
          v-model="password"
          :label="$t('login.PASSWORD_LABEL')"
          type="password"
          required />
        <div
          v-if="loading"
          class="text-xs-center info--text">
          <v-progress-circular :indeterminate="true" />
        </div>
        <div
          v-if="message"
          class="text-xs-center title error--text">
          {{ message }}
        </div>
        <div
          v-show="loginFailed"
          class="text-xs-center title error--text">
          {{ $t('login.FORGOT_PASSWORD_MESSAGE') }}
          <a
            class="error--text font-weight-bold"
            @click="navigagteToForgotPassword">
            {{ $t('login.FORGOT_PASSWORD_BUTTON_LABEL') }}
          </a>
        </div>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        color="black"
        flat
        @click="navigateToRegistration">
        {{ $t('login.REGISTRATION_BUTTON') }}
      </v-btn>
      <v-btn
        color="info"
        :disabled="preventSubmission"
        @click="login">
        {{ $t('login.LOGIN_BUTTON') }}
      </v-btn>
    </v-card-actions>
  </div>
</template>

