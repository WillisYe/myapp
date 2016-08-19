
define(['app', 'js/utils/tips', 'lib/jquery/jquery1.9.1.min', 'lib/toastr/toastr.min'], function (app, Tips, $, toastr) {
    app.controller('toastrCtrl', ['$scope', '$ionicHistory', 'httpRequest', '$ionicSlideBoxDelegate', '$sce', '$cordovaInAppBrowser', toastrCtrl]);
    function toastrCtrl($scope, $ionicHistory, httpRequest, $ionicSlideBoxDelegate, $sce, $cordovaInAppBrowser) {
        var vm = this;
        //参数设置，若用默认值可以省略以下面代
        toastr.options = {
            "closeButton": false, //是否显示关闭按钮
            "debug": false, //是否使用debug模式
            "positionClass": "toast-bottom-center",//弹出窗的位置
            "showDuration": "300",//显示的动画时间
            "hideDuration": "1000",//消失的动画时间
            "timeOut": "5000", //展现时间
            "extendedTimeOut": "1000",//加长展示时间
            "showEasing": "swing",//显示时的动画缓冲方式
            "hideEasing": "linear",//消失时的动画缓冲方式
            "showMethod": "fadeIn",//显示时的动画方式
            "hideMethod": "fadeOut" //消失时的动画方式
        };

        //成功提示绑定
        vm.success = function () {
            toastr.success("祝贺你成功了");
        }

        // //信息提示绑定
        vm.info = function () {
            toastr.info("祝贺你成功了");
        }

        // //敬告提示绑定
        vm.warning = function () {
            toastr.warning("祝贺你成功了");
        }

        // //错语提示绑定
        vm.error = function () {
            toastr.error("祝贺你成功了");
        }

        // //清除窗口绑定
        vm.clear = function () {
            toastr.clear();
        }

        $scope.goBack = () => {
            $ionicHistory.goBack()
        }
    }

});

