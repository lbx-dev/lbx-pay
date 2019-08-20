import CommonStore from './common/common.store';
import UserStore from './authorization/user/user.store';
import RegistrationStore from './authorization/registration/registration.store';
import ForgotPasswordStore from './authorization/forgot-password/forgot-password.store';
import RestorePasswordStore from './authorization/restore-password/restore-password.store';
import LanguageStore from './languages/languages.store';
import PayStore from './pay/pay.store';


export default {
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    common: CommonStore,
    user: UserStore,
    registration: RegistrationStore,
    forgotPassword: ForgotPasswordStore,
    restorePassword: RestorePasswordStore,
    languages: LanguageStore,
    pay: PayStore
  },
  actions: {
    async nuxtServerInit({ dispatch, commit }, { req, app }) {
      commit('common/SET_RANDOM_SECURITY', process.env.RANDOM_SECURITY);

      const roleSetting = dispatch('common/DO_SET_ROLES');
      const languageLoading = dispatch('languages/DO_LOAD_LANGUAGES', { i18n: app.i18n, cookies: req.cookies });

      await roleSetting;
      await languageLoading;
    }
  }
};