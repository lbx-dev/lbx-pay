<style scoped>

</style>
<script>
  export default {
    name: 'Registration',
    layout: 'access',
    nuxtI18n: {
      paths: {
        us: '/registration',
        rs: '/registracija'
      }
    },
    head() {
      return this.$getPageName(this.$t('registration.TITLE'));
    },
    data() {
      const roles = this.$store.getters['common/getRoles'].filter(item => item.name !== 'administrator');
      return {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        repeatPassword: '',
        roles: roles,
        selectedRole: roles[0].id,
        message: '',
        loading: false
      };
    },
    computed: {
      USER() {
        return {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          password: this.password,
          roleId: this.selectedRole
        };
      },
      preventSubmission() {
        const { isEmailValid } = this.$formValidators();
        return !(
          this.firstName &&
          this.firstName.length < 128 &&
          this.lastName &&
          this.lastName.length < 128 &&
          this.email &&
          isEmailValid(this.email) &&
          this.password &&
          this.password === this.repeatPassword
        );
      },
      firstNameRules() {
        return this.$formValidators().firstNameRules;
      },
      lastNameRules() {
        return this.$formValidators().lastNameRules;
      },
      emailRules() {
        return this.$formValidators().emailRules;
      },
      repeatPasswordRules() {
        return this.$formValidators().repeatPasswordRules;
      }
    },
    asyncData({ store }) {
      store.dispatch('common/DO_SET_HEADER', store.state.i18n.messages.registration.HEAD);

      return {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        repeatPassword: '',
        roles: [],
        selectedRole: '',
        message: '',
        loading: false
      };
    },
    methods: {
      navigateToLogin() {
        this.$router.push(this.localePath({ name: 'login' }));
      },
      reset() {
        this.loading = false;
        this.message = '';
      },
      async register() {
        if(this.preventSubmission) {
          return;
        }
        this.loading = true;

        try {
          await this.$store.dispatch('registration/DO_REGISTER', this.USER);

          this.loading = false;

          this.$router.push(this.localePath({ name: 'login' }));
        } catch(error) {
          this.loading = false;
          this.message = error.response.data;
          setTimeout(this.reset, 1500);
        }
      }
    }
  };
</script>
<template>
  <div>
    <v-card-text>
      <v-form @keyup.enter.native="register">
        <v-text-field
          v-model="firstName"
          :rules="firstNameRules"
          :label="$t('registration.FIRST_NAME_LABEL')"
          required />
        <v-text-field
          v-model="lastName"
          :rules="lastNameRules"
          :label="$t('registration.LAST_NAME_LABEL')"
          required />
        <v-text-field
          v-model="email"
          :rules="emailRules"
          :label="$t('registration.EMAIL_LABEL')"
          validate-on-blur
          required />
        <v-text-field
          v-model="password"
          type="password"
          :label="$t('registration.PASSWORD_LABEL')"
          required />
        <v-text-field
          v-model="repeatPassword"
          type="password"
          :rules="repeatPasswordRules"
          :label="$t('registration.REPEAT_PASSWORD_LABEL')"
          required />
        <v-select
          v-show="roles.length > 1"
          v-model="selectedRole"
          :items="roles"
          item-text="name"
          item-value="id"
          label="Role" />
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
        {{ $t('registration.LOGIN_BUTTON') }}
      </v-btn>
      <v-btn
        :disabled="preventSubmission"
        color="info"
        @click="register">
        {{ $t('registration.REGISTRATION_BUTTON') }}
      </v-btn>
    </v-card-actions>
  </div>
</template>