// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  useHash: true,
  hmr: false,
  application: {
    name: '控制平台',
    logoUrl: '',
    description: ''
  },
  oAuthConfig: {
    issuer: 'http://localhost:5000',
    clientId: 'Control-Client',
    dummyClientSecret: '3da79fa3-F46A-4821-B7A6-2d1a8a416e5b',
    scope: 'openid profile email',
    showDebugInformation: true,
    oidc: false,
    requireHttps: false,
    redirectUri: 'http://localhost:4200',
  },
  apis: {
    control: 'http://localhost:5001',
    abpConfig: '',
    logout: '',
    getProfile: '',
    putProfile: '',
    changePwd: '',
  },
  urls: {
    login: '/passport/login'
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
