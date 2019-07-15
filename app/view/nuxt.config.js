const { baseURL } = require('app/common/environment/environment.service');

module.exports = {
  mode: 'universal',
  srcDir: 'app/view/',
  ignore: [ 'app/view/nuxt.config.js' ],
  css: [
    { src: '~/../../node_modules/vuetify/dist/vuetify.css', lang: 'css' },
    { src: '@/styles/index.scss', lang: 'sass' }

  ],
  head: {
    link: [
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Material+Icons' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' },
      { rel: 'icon', type: 'image/x-icon', href: '/images/favicon/favicon.ico' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/images/favicon/favicon-16x16.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/images/favicon/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/images/favicon/android-chrome-192x192.png' },
      { rel: 'icon', type: 'image/png', sizes: '512x512', href: '/images/favicon/android-chrome-512x512.png' },
      { rel: 'icon', type: 'image/png', sizes: '180x180', href: '/images/favicon/apple-touch-icon.png' },
      { rel: 'mask-icon', color: '#000000', href: '/images/favicon/safari-pinned-tab.svg' },
      { rel: 'manifest', href: '/images/favicon/site.webmanifest' }
    ],
    script: [ ],
    meta: [
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0'
      }, {
        name: 'msapplication-TileColor',
        content: '#000000'
      }, {
        name: 'msapplication-TileImage',
        content: '/images/favicon/mstile-150x150.png'
      }, {
        name: 'msapplication-config',
        content: '/images/favicon/browserconfig.xml'
      }
    ]
  },
  plugins: [
    '~/plugins/vuetify',
    '~/plugins/form-validation/form-validation.plugin.js',
    '~/plugins/page-name/page-name.plugin.js',
    '~/plugins/query-validation/query-validation.plugin.js',
    '~/plugins/uuid-validation/uuid-validation.plugin.js',
    { src: '~/plugins/cookie-removal/cookie-removal.js', mode: 'client' }
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    'nuxt-material-design-icons', [
      'nuxt-i18n', {
        locales: [
          { code: 'us', iso: 'en-US', file: 'en-US.js' },
          { code: 'rs', iso: 'rs-RS', file: 'rs-RS.js' }
        ],
        routesNameSeparator: '___',
        lazy: true,
        langDir: 'languages/',
        strategy: 'prefix',
        defaultLocale: 'us',
        detectBrowserLanguage: {
          useCookie: true,
          cookieKey: 'language',
          alwaysRedirect: false,
          fallbackLocale: 'em'
        },
        vuex: {
          moduleName: 'i18n',

          mutations: {
            setLocale: 'I18N_SET_LOCALE',
            setMessages: 'I18N_SET_MESSAGES'
          },

          preserveState: false
        }
      }
    ]
  ],
  axios: {
    baseURL
  },
  router: {
    extendRoutes(nuxtRoutes) {
      nuxtRoutes.map(route => {
        route.path = route.path.replace('/authorization', '');
        route.name = route.name.replace('authorization-', '');
        if(route.path !== '/dashboard') {
          route.path = route.path.replace('/dashboard', '');
          route.name = route.name.replace('dashboard-', '');

          route.name = route.name.replace('administrator-', '');
        }
        return route;
      });
    },
    middleware: [ 'security', 'redirection' ]
  }
};