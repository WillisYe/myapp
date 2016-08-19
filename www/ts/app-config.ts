
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
                platform: 3,      //1:iOS 2:android 3:web
                is_wechat: ionic.Platform.ua.toLowerCase().match(/MicroMessenger/i) == "micromessenger",
            }

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
                    tpl += ('<div class="row">' + content + '</div>')
                }
                $ionicLoading.show({
                    noBackdrop: noBackdrop,
                    template: tpl
                });
            }
            $rootScope.$on('loadding', function (child, flag, content) {
                if (flag == 'false') {
                    $ionicLoading.hide();
                } else if (flag == 'noBackdrop') {
                    showLoadding(true, content);
                } else {
                    showLoadding(false, content)
                }
            })

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
                        } else {
                            $rootScope.backButtonPressedOnceToExit = true;
                            $cordovaToast.showShortTop('再按一次退出系统');
                            setTimeout(function () {
                                $rootScope.backButtonPressedOnceToExit = false;
                            }, 2000);
                        }
                    }
                    else if ($ionicHistory.backView()) {
                        $ionicHistory.goBack();
                    } else {
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


