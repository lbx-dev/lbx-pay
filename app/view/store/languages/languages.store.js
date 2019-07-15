export default {
  namespaced: true,
  state() {
    return {
      languages: [],
      selected: ''
    };
  },
  mutations: {
    SET_LANGUAGES(state, { languages, selected }) {
      state.languages = languages;
      state.selected = selected;
    },
    SET_SELECTED_LANGUAGE(state, { language }) {
      state.selected = language;
    }
  },
  getters: {
    getSelected(state) {
      return state.selected;
    },
    getAvailable(state) {
      return state.languages;
    }
  },
  actions: {
    DO_SELECT_LANGUAGE({ commit }, language) {
      commit('SET_SELECTED_LANGUAGE', language);
    },
    DO_LOAD_LANGUAGES({ commit }, { i18n, cookies }) {
      const languages = i18n.locales.map(item => item.code);
      const selected = cookies.language;

      if(selected && languages.find(item => item === selected)) {
        commit('SET_LANGUAGES', { languages, selected });
        return;
      }
      commit('SET_LANGUAGES', { languages, selected: i18n.defaultLocale });
    }
  }
};