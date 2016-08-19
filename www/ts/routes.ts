define([
  'app'
],function (app) {
    app
    .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
        $stateProvider
            .state('tab', {    
                url: '/tab', 
                abstract: true,
                templateUrl: function() {
                    return "templates/tab.html";
                },
                cache:false                
            })

            .state('tab.html', {  //菜單
              url: '/html',
              views: {
                'tab-html': {
                  templateUrl: function() {
                    return 'templates/tab-html.html';
                  },
                  controller: "htmlCtrl",
                  controllerUrl: 'js/controllers/html.js',
                  cache:false,
                }
              }
            })

            .state('tab.css', {  //尋寶
              url: '/css',
              views: {
                'tab-css': {
                  templateUrl: function() {
                    return 'templates/tab-css.html';
                  },
                  controller: "cssCtrl",
                  controllerUrl: 'js/controllers/css.js',
                  cache:false
                }
              },
            })
            
            .state('tab.js', {  //個人中心
              url: '/js',
              views: {
                'tab-js': {
                  templateUrl: function() {
                    return 'templates/tab-js.html';
                  },
                  controller: "jsCtrl",
                  controllerUrl: 'js/controllers/js.js',
                  cache:false
                }
              }
            })

            .state('tab.cordova', {  //更多
              url: '/cordova',
              views: {
                'tab-cordova': {
                  templateUrl: function() {
                    return 'templates/tab-cordova.html';
                  },
                  controller: "cordovaCtrl",
                  controllerUrl: 'js/controllers/cordova.js',                  
                  cache:false
                }
              }
            })

            // 尋寶相關頁面    tree /f >>d:\a.txt         
            .state.apply({}, stateJson('html', 'test')) // 免責聲明          
            .state.apply({}, stateJson('html', 'toastr', {controllerAs: 'mytoastr'})) // 免責聲明          
            .state.apply({}, stateJson('html', 'es6', {controllerAs: 'myes6'})) // 免責聲明          

        $urlRouterProvider.otherwise("tab/html");
        // $locationProvider.html5Mode(true);

    });

    // 返迴路由參數，p父文件夾，s文件名，e路由擴展設置（json格式）可以覆蓋默認設置
    function stateJson(p, s, e){
      var params = angular.extend({      
          url: '/' + s,
          templateUrl: function() {
              return "templates/"+p+"/"+s+".html";
          },
          controllerUrl: "js/controllers/"+p+"/"+s+".js",
          controller: s+"Ctrl",
          cache:false
      }, e) 
      return [s, params];
    }
})