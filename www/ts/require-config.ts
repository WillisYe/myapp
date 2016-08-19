
require.config({
    baseUrl: '',
    paths: {
        'app': 'js/app',
        'appConfig':'js/app-config',
        'routes': 'js/routes',
        'ionic': 'lib/ionic/js/ionic.bundle.min',
        'bootstrap':'js/bootstrap',
        'asyncLoader': 'lib/async-loader/angular-async-loader',
        'zepto':'lib/zepto/zepto.min',
        'wx': 'lib/weixin/jweixin-1.0.0',
        'qrcode': 'lib/qrcodejs/qrcode.min',
        'fusion': 'lib/fusioncharts/fusioncharts',
        'fusioncharts': 'lib/fusioncharts/fusioncharts.charts',
        'fusionchartstheme': 'lib/fusioncharts/themes/fusioncharts.theme.fint',        
        'ngCordova':"lib/ngCordova/dist/ng-cordova",
        'cordova':'cordova'
    },
    shim: {
        'app': {
          deps: ['ionic']
        },
        'routes': {
          deps: ['ionic','app']
        },
        'appConfig':{
          deps: ['app']
        },
        'ionic' : {exports : 'ionic'},
        'cordova':{
          deps: ['ngCordova']
        },
    },
    priority: [
      'ionic',
      'app',
      'routes',
      'appConfig'
    ],
    deps: [
      'bootstrap'
    ]
});

// define(['ionic','routes','app','appConfig'], function (ionic,routes,app,appConfig) {

// // document.getElementsByTagName('html')[0]

//     angular.element(document).ready(function () {
//         try {
//           angular.bootstrap(document, ['ionicdemo']);
//         } catch (e) {
//           console.error(e.stack || e.message || e);
//         }
//     });
// });


