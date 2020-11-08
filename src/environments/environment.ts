// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyC_8FqAP5y4uECVhgtFPFIGXT94pDV66RM',
    authDomain: 'silver-stratum-294619.firebaseapp.com',
    databaseURL: 'https://silver-stratum-294619.firebaseio.com',
    projectId: 'silver-stratum-294619',
    storageBucket: 'silver-stratum-294619.appspot.com',
    messagingSenderId: '716338201899',
    appId: '1:716338201899:web:33afd25db21704c83b716e',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
