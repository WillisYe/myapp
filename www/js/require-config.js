require.config({
    baseUrl: '',
    paths: {
        'app': 'js/app',
        'appConfig': 'js/app-config',
        'routes': 'js/routes',
        'ionic': 'lib/ionic/js/ionic.bundle.min',
        'bootstrap': 'js/bootstrap',
        'asyncLoader': 'lib/async-loader/angular-async-loader',
        'zepto': 'lib/zepto/zepto.min',
        'wx': 'lib/weixin/jweixin-1.0.0',
        'qrcode': 'lib/qrcodejs/qrcode.min',
        'fusion': 'lib/fusioncharts/fusioncharts',
        'fusioncharts': 'lib/fusioncharts/fusioncharts.charts',
        'fusionchartstheme': 'lib/fusioncharts/themes/fusioncharts.theme.fint',
        'ngCordova': "lib/ngCordova/dist/ng-cordova",
        'cordova': 'cordova'
    },
    shim: {
        'app': {
            deps: ['ionic']
        },
        'routes': {
            deps: ['ionic', 'app']
        },
        'appConfig': {
            deps: ['app']
        },
        'ionic': { exports: 'ionic' },
        'cordova': {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWlyZS1jb25maWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi90cy9yZXF1aXJlLWNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLENBQUMsTUFBTSxDQUFDO0lBQ1gsT0FBTyxFQUFFLEVBQUU7SUFDWCxLQUFLLEVBQUU7UUFDSCxLQUFLLEVBQUUsUUFBUTtRQUNmLFdBQVcsRUFBQyxlQUFlO1FBQzNCLFFBQVEsRUFBRSxXQUFXO1FBQ3JCLE9BQU8sRUFBRSwrQkFBK0I7UUFDeEMsV0FBVyxFQUFDLGNBQWM7UUFDMUIsYUFBYSxFQUFFLHVDQUF1QztRQUN0RCxPQUFPLEVBQUMscUJBQXFCO1FBQzdCLElBQUksRUFBRSwwQkFBMEI7UUFDaEMsUUFBUSxFQUFFLHlCQUF5QjtRQUNuQyxRQUFRLEVBQUUsK0JBQStCO1FBQ3pDLGNBQWMsRUFBRSxzQ0FBc0M7UUFDdEQsbUJBQW1CLEVBQUUsaURBQWlEO1FBQ3RFLFdBQVcsRUFBQywrQkFBK0I7UUFDM0MsU0FBUyxFQUFDLFNBQVM7S0FDdEI7SUFDRCxJQUFJLEVBQUU7UUFDRixLQUFLLEVBQUU7WUFDTCxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUM7U0FDaEI7UUFDRCxRQUFRLEVBQUU7WUFDUixJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUMsS0FBSyxDQUFDO1NBQ3RCO1FBQ0QsV0FBVyxFQUFDO1lBQ1YsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDO1NBQ2Q7UUFDRCxPQUFPLEVBQUcsRUFBQyxPQUFPLEVBQUcsT0FBTyxFQUFDO1FBQzdCLFNBQVMsRUFBQztZQUNSLElBQUksRUFBRSxDQUFDLFdBQVcsQ0FBQztTQUNwQjtLQUNKO0lBQ0QsUUFBUSxFQUFFO1FBQ1IsT0FBTztRQUNQLEtBQUs7UUFDTCxRQUFRO1FBQ1IsV0FBVztLQUNaO0lBQ0QsSUFBSSxFQUFFO1FBQ0osV0FBVztLQUNaO0NBQ0osQ0FBQyxDQUFDO0FBRUgsdUZBQXVGO0FBRXZGLDhDQUE4QztBQUU5QyxvREFBb0Q7QUFDcEQsZ0JBQWdCO0FBQ2hCLHdEQUF3RDtBQUN4RCx3QkFBd0I7QUFDeEIsc0RBQXNEO0FBQ3RELFlBQVk7QUFDWixVQUFVO0FBQ1YsTUFBTSJ9