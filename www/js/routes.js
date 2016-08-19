define([
    'app'
], function (app) {
    app
        .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $stateProvider
            .state('tab', {
            url: '/tab',
            abstract: true,
            templateUrl: function () {
                return "templates/tab.html";
            },
            cache: false
        })
            .state('tab.html', {
            url: '/html',
            views: {
                'tab-html': {
                    templateUrl: function () {
                        return 'templates/tab-html.html';
                    },
                    controller: "htmlCtrl",
                    controllerUrl: 'js/controllers/html.js',
                    cache: false,
                }
            }
        })
            .state('tab.css', {
            url: '/css',
            views: {
                'tab-css': {
                    templateUrl: function () {
                        return 'templates/tab-css.html';
                    },
                    controller: "cssCtrl",
                    controllerUrl: 'js/controllers/css.js',
                    cache: false
                }
            },
        })
            .state('tab.js', {
            url: '/js',
            views: {
                'tab-js': {
                    templateUrl: function () {
                        return 'templates/tab-js.html';
                    },
                    controller: "jsCtrl",
                    controllerUrl: 'js/controllers/js.js',
                    cache: false
                }
            }
        })
            .state('tab.cordova', {
            url: '/cordova',
            views: {
                'tab-cordova': {
                    templateUrl: function () {
                        return 'templates/tab-cordova.html';
                    },
                    controller: "cordovaCtrl",
                    controllerUrl: 'js/controllers/cordova.js',
                    cache: false
                }
            }
        })
            .state.apply({}, stateJson('html', 'test')) // 免責聲明          
            .state.apply({}, stateJson('html', 'toastr', { controllerAs: 'mytoastr' })) // 免責聲明          
            .state.apply({}, stateJson('html', 'es6', { controllerAs: 'myes6' })); // 免責聲明          
        $urlRouterProvider.otherwise("tab/html");
        // $locationProvider.html5Mode(true);
    });
    // 返迴路由參數，p父文件夾，s文件名，e路由擴展設置（json格式）可以覆蓋默認設置
    function stateJson(p, s, e) {
        var params = angular.extend({
            url: '/' + s,
            templateUrl: function () {
                return "templates/" + p + "/" + s + ".html";
            },
            controllerUrl: "js/controllers/" + p + "/" + s + ".js",
            controller: s + "Ctrl",
            cache: false
        }, e);
        return [s, params];
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vdHMvcm91dGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sQ0FBQztJQUNMLEtBQUs7Q0FDTixFQUFDLFVBQVUsR0FBRztJQUNYLEdBQUc7U0FDRixNQUFNLENBQUMsVUFBUyxjQUFjLEVBQUUsa0JBQWtCLEVBQUUsaUJBQWlCO1FBQ2xFLGNBQWM7YUFDVCxLQUFLLENBQUMsS0FBSyxFQUFFO1lBQ1YsR0FBRyxFQUFFLE1BQU07WUFDWCxRQUFRLEVBQUUsSUFBSTtZQUNkLFdBQVcsRUFBRTtnQkFDVCxNQUFNLENBQUMsb0JBQW9CLENBQUM7WUFDaEMsQ0FBQztZQUNELEtBQUssRUFBQyxLQUFLO1NBQ2QsQ0FBQzthQUVELEtBQUssQ0FBQyxVQUFVLEVBQUU7WUFDakIsR0FBRyxFQUFFLE9BQU87WUFDWixLQUFLLEVBQUU7Z0JBQ0wsVUFBVSxFQUFFO29CQUNWLFdBQVcsRUFBRTt3QkFDWCxNQUFNLENBQUMseUJBQXlCLENBQUM7b0JBQ25DLENBQUM7b0JBQ0QsVUFBVSxFQUFFLFVBQVU7b0JBQ3RCLGFBQWEsRUFBRSx3QkFBd0I7b0JBQ3ZDLEtBQUssRUFBQyxLQUFLO2lCQUNaO2FBQ0Y7U0FDRixDQUFDO2FBRUQsS0FBSyxDQUFDLFNBQVMsRUFBRTtZQUNoQixHQUFHLEVBQUUsTUFBTTtZQUNYLEtBQUssRUFBRTtnQkFDTCxTQUFTLEVBQUU7b0JBQ1QsV0FBVyxFQUFFO3dCQUNYLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQztvQkFDbEMsQ0FBQztvQkFDRCxVQUFVLEVBQUUsU0FBUztvQkFDckIsYUFBYSxFQUFFLHVCQUF1QjtvQkFDdEMsS0FBSyxFQUFDLEtBQUs7aUJBQ1o7YUFDRjtTQUNGLENBQUM7YUFFRCxLQUFLLENBQUMsUUFBUSxFQUFFO1lBQ2YsR0FBRyxFQUFFLEtBQUs7WUFDVixLQUFLLEVBQUU7Z0JBQ0wsUUFBUSxFQUFFO29CQUNSLFdBQVcsRUFBRTt3QkFDWCxNQUFNLENBQUMsdUJBQXVCLENBQUM7b0JBQ2pDLENBQUM7b0JBQ0QsVUFBVSxFQUFFLFFBQVE7b0JBQ3BCLGFBQWEsRUFBRSxzQkFBc0I7b0JBQ3JDLEtBQUssRUFBQyxLQUFLO2lCQUNaO2FBQ0Y7U0FDRixDQUFDO2FBRUQsS0FBSyxDQUFDLGFBQWEsRUFBRTtZQUNwQixHQUFHLEVBQUUsVUFBVTtZQUNmLEtBQUssRUFBRTtnQkFDTCxhQUFhLEVBQUU7b0JBQ2IsV0FBVyxFQUFFO3dCQUNYLE1BQU0sQ0FBQyw0QkFBNEIsQ0FBQztvQkFDdEMsQ0FBQztvQkFDRCxVQUFVLEVBQUUsYUFBYTtvQkFDekIsYUFBYSxFQUFFLDJCQUEyQjtvQkFDMUMsS0FBSyxFQUFDLEtBQUs7aUJBQ1o7YUFDRjtTQUNGLENBQUM7YUFHRCxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxTQUFTLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsaUJBQWlCO2FBQzVELEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLFNBQVMsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLEVBQUMsWUFBWSxFQUFFLFVBQVUsRUFBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUI7YUFDMUYsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsU0FBUyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBQyxZQUFZLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQyxDQUFBLENBQUMsaUJBQWlCO1FBRXpGLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN6QyxxQ0FBcUM7SUFFekMsQ0FBQyxDQUFDLENBQUM7SUFFSCw0Q0FBNEM7SUFDNUMsbUJBQW1CLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztRQUN4QixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO1lBQ3hCLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBQztZQUNaLFdBQVcsRUFBRTtnQkFDVCxNQUFNLENBQUMsWUFBWSxHQUFDLENBQUMsR0FBQyxHQUFHLEdBQUMsQ0FBQyxHQUFDLE9BQU8sQ0FBQztZQUN4QyxDQUFDO1lBQ0QsYUFBYSxFQUFFLGlCQUFpQixHQUFDLENBQUMsR0FBQyxHQUFHLEdBQUMsQ0FBQyxHQUFDLEtBQUs7WUFDOUMsVUFBVSxFQUFFLENBQUMsR0FBQyxNQUFNO1lBQ3BCLEtBQUssRUFBQyxLQUFLO1NBQ2QsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUNMLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNyQixDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUEifQ==