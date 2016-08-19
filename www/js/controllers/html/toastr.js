define(['app', 'js/utils/tips', 'lib/jquery/jquery1.9.1.min', 'lib/toastr/toastr.min'], function (app, Tips, $, toastr) {
    app.controller('toastrCtrl', ['$scope', '$ionicHistory', 'httpRequest', '$ionicSlideBoxDelegate', '$sce', '$cordovaInAppBrowser', toastrCtrl]);
    function toastrCtrl($scope, $ionicHistory, httpRequest, $ionicSlideBoxDelegate, $sce, $cordovaInAppBrowser) {
        var vm = this;
        //参数设置，若用默认值可以省略以下面代
        toastr.options = {
            "closeButton": false,
            "debug": false,
            "positionClass": "toast-bottom-center",
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut" //消失时的动画方式
        };
        //成功提示绑定
        vm.success = function () {
            toastr.success("祝贺你成功了");
        };
        // //信息提示绑定
        vm.info = function () {
            toastr.info("祝贺你成功了");
        };
        // //敬告提示绑定
        vm.warning = function () {
            toastr.warning("祝贺你成功了");
        };
        // //错语提示绑定
        vm.error = function () {
            toastr.error("祝贺你成功了");
        };
        // //清除窗口绑定
        vm.clear = function () {
            toastr.clear();
        };
        $scope.goBack = function () {
            $ionicHistory.goBack();
        };
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9hc3RyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vdHMvY29udHJvbGxlcnMvaHRtbC90b2FzdHIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFLGVBQWUsRUFBRSw0QkFBNEIsRUFBRSx1QkFBdUIsQ0FBQyxFQUFFLFVBQVUsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsTUFBTTtJQUNsSCxHQUFHLENBQUMsVUFBVSxDQUFDLFlBQVksRUFBRSxDQUFDLFFBQVEsRUFBRSxlQUFlLEVBQUUsYUFBYSxFQUFFLHdCQUF3QixFQUFFLE1BQU0sRUFBRSxzQkFBc0IsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQy9JLG9CQUFvQixNQUFNLEVBQUUsYUFBYSxFQUFFLFdBQVcsRUFBRSxzQkFBc0IsRUFBRSxJQUFJLEVBQUUsb0JBQW9CO1FBQ3RHLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQztRQUNkLG9CQUFvQjtRQUNwQixNQUFNLENBQUMsT0FBTyxHQUFHO1lBQ2IsYUFBYSxFQUFFLEtBQUs7WUFDcEIsT0FBTyxFQUFFLEtBQUs7WUFDZCxlQUFlLEVBQUUscUJBQXFCO1lBQ3RDLGNBQWMsRUFBRSxLQUFLO1lBQ3JCLGNBQWMsRUFBRSxNQUFNO1lBQ3RCLFNBQVMsRUFBRSxNQUFNO1lBQ2pCLGlCQUFpQixFQUFFLE1BQU07WUFDekIsWUFBWSxFQUFFLE9BQU87WUFDckIsWUFBWSxFQUFFLFFBQVE7WUFDdEIsWUFBWSxFQUFFLFFBQVE7WUFDdEIsWUFBWSxFQUFFLFNBQVMsQ0FBQyxVQUFVO1NBQ3JDLENBQUM7UUFFRixRQUFRO1FBQ1IsRUFBRSxDQUFDLE9BQU8sR0FBRztZQUNULE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDN0IsQ0FBQyxDQUFBO1FBRUQsV0FBVztRQUNYLEVBQUUsQ0FBQyxJQUFJLEdBQUc7WUFDTixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzFCLENBQUMsQ0FBQTtRQUVELFdBQVc7UUFDWCxFQUFFLENBQUMsT0FBTyxHQUFHO1lBQ1QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM3QixDQUFDLENBQUE7UUFFRCxXQUFXO1FBQ1gsRUFBRSxDQUFDLEtBQUssR0FBRztZQUNQLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDM0IsQ0FBQyxDQUFBO1FBRUQsV0FBVztRQUNYLEVBQUUsQ0FBQyxLQUFLLEdBQUc7WUFDUCxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDbkIsQ0FBQyxDQUFBO1FBRUQsTUFBTSxDQUFDLE1BQU0sR0FBRztZQUNaLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQTtRQUMxQixDQUFDLENBQUE7SUFDTCxDQUFDO0FBRUwsQ0FBQyxDQUFDLENBQUMifQ==