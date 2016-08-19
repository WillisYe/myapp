define(['app', 'js/utils/httpRequest'], function (app, $h) {
    app
        .config(['$ionicConfigProvider', '$sceDelegateProvider', function ($ionicConfigProvider, $sceDelegateProvider) {
            $ionicConfigProvider.tabs.position('bottom'); // other values: top
            $ionicConfigProvider.platform.android.views.maxCache(5); //安卓缓存5个view，ios默认10个
            $sceDelegateProvider.resourceUrlWhitelist([
                // Allow same origin resource loads.
                'self',
                // Allow loading from our assets domain.  Notice the difference between * and **.
                'https://at.alicdn.com/**'
            ]);
            /*    // The blacklist overrides the whitelist so the open redirect here is blocked.
            *    $sceDelegateProvider.resourceUrlBlacklist([
            *      'http://myapp.example.com/clickThru**'
            *    ]);
            */
            window.APP = {
                baseUrl: 'http://c.damaiplus.com/gczx/web/',
                app_version: '1.0.0',
                app_key: 'GDGHDKJ41C95F45C140D6B4D33C97E6A',
                platform: 3,
                is_wechat: ionic.Platform.ua.toLowerCase().match(/MicroMessenger/i) == "micromessenger",
            };
            //   // 获取用户uid和token，APP中不可以用cookie
            //   if(!getCookie("auth")){
            //       // 浏览器端模拟数据
            //       setCookie('auth', '16|MDBlZmJiNjYwYWUyY2IwZTcxYWM5NTc1ZDUyYmM2NjM=|yefeng')              
            //   }
            //   var auth_arry = getCookie("auth").split('|'); 
            //   var uid = auth_arry[0];
            //   var token = auth_arry[1];
            //   var sign = auth_arry[2];
            //   sessionStorage.setItem("dm_uid", uid);
            //   sessionStorage.setItem("dm_token", token);
            //   sessionStorage.setItem("dm_sign", sign);                    
        }])
        .run(function ($ionicPlatform, $rootScope, $ionicLoading, $cordovaToast, $location, $ionicHistory) {
        //注册loadding
        function showLoadding(noBackdrop, content) {
            var tpl = '<div class="spinner"><div class="spinner-container container1"><div class="circle1"></div>' +
                '<div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div>' +
                '<div class="spinner-container container2"><div class="circle1"></div><div class="circle2">' +
                '</div><div class="circle3"></div><div class="circle4"></div></div><div class="spinner-container container3">' +
                '<div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4">' +
                '</div></div></div>';
            if (content) {
                tpl += ('<div class="row">' + content + '</div>');
            }
            $ionicLoading.show({
                noBackdrop: noBackdrop,
                template: tpl
            });
        }
        $rootScope.$on('loadding', function (child, flag, content) {
            if (flag == 'false') {
                $ionicLoading.hide();
            }
            else if (flag == 'noBackdrop') {
                showLoadding(true, content);
            }
            else {
                showLoadding(false, content);
            }
        });
        var htmlEl = angular.element(document.querySelector('html'));
        htmlEl.on("click", function (e) {
            if (e.target.nodeName === "HTML" &&
                $rootScope.popup) {
                $rootScope.popup.close();
                $rootScope.popup = null;
            }
        });
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleLightContent();
            }
            $ionicPlatform.registerBackButtonAction(function (e) {
                //判断处于哪个页面时双击退出
                if (($location.path() == '/tab/menu') || ($location.path() == '/tab/user') || ($location.path() == '/tab/hunt') || ($location.path() == '/tab/more')) {
                    if ($rootScope.backButtonPressedOnceToExit) {
                        ionic.Platform.exitApp();
                    }
                    else {
                        $rootScope.backButtonPressedOnceToExit = true;
                        $cordovaToast.showShortTop('再按一次退出系统');
                        setTimeout(function () {
                            $rootScope.backButtonPressedOnceToExit = false;
                        }, 2000);
                    }
                }
                else if ($ionicHistory.backView()) {
                    $ionicHistory.goBack();
                }
                else {
                    $rootScope.backButtonPressedOnceToExit = true;
                    $cordovaToast.showShortTop('再按一次退出系统');
                    setTimeout(function () {
                        $rootScope.backButtonPressedOnceToExit = false;
                    }, 2000);
                }
                e.preventDefault();
                return false;
            }, 101);
        });
    });
    // 写入cookies
    function setCookie(name, value) {
        var Days = 30;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    }
    // 读取cookies
    function getCookie(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    }
    // 删除cookies
    function delCookie(name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = getCookie(name);
        if (cval != null)
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3RzL2FwcC1jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFLHNCQUFzQixDQUFDLEVBQUUsVUFBVSxHQUFHLEVBQUUsRUFBRTtJQUNyRCxHQUFHO1NBQ0UsTUFBTSxDQUFDLENBQUMsc0JBQXNCLEVBQUUsc0JBQXNCLEVBQUUsVUFBVSxvQkFBb0IsRUFBRSxvQkFBb0I7WUFDekcsb0JBQW9CLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLG9CQUFvQjtZQUNsRSxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxxQkFBcUI7WUFFOUUsb0JBQW9CLENBQUMsb0JBQW9CLENBQUM7Z0JBQ3RDLG9DQUFvQztnQkFDcEMsTUFBTTtnQkFDTixpRkFBaUY7Z0JBQ2pGLDBCQUEwQjthQUM3QixDQUFDLENBQUM7WUFFSDs7OztjQUlFO1lBRUYsTUFBTSxDQUFDLEdBQUcsR0FBRztnQkFDVCxPQUFPLEVBQUUsa0NBQWtDO2dCQUMzQyxXQUFXLEVBQUUsT0FBTztnQkFDcEIsT0FBTyxFQUFFLGtDQUFrQztnQkFDM0MsUUFBUSxFQUFFLENBQUM7Z0JBQ1gsU0FBUyxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLGdCQUFnQjthQUMxRixDQUFBO1lBRUQsb0NBQW9DO1lBQ3BDLDRCQUE0QjtZQUM1QixvQkFBb0I7WUFDcEIsa0dBQWtHO1lBQ2xHLE1BQU07WUFDTixtREFBbUQ7WUFDbkQsNEJBQTRCO1lBQzVCLDhCQUE4QjtZQUM5Qiw2QkFBNkI7WUFDN0IsMkNBQTJDO1lBQzNDLCtDQUErQztZQUMvQyxpRUFBaUU7UUFDckUsQ0FB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