
define(['app', 'js/utils/tips', 'js/directives/dmNum'], function (app, Tips) {
    app.controller('cssCtrl', ['$scope', '$ionicHistory', 'httpRequest', '$ionicSlideBoxDelegate', '$location', function ($scope, $ionicHistory, httpRequest, $ionicSlideBoxDelegate, $location) {
        $scope.banners = [];
        $scope.getBanners = () => {
            var params = {
                type: 1
            }
            httpRequest.post('api/?method=other.adList', params, (xhr, data) => {
                if (data.state === 1) {
                    $scope.banners = data.data;
                    $ionicSlideBoxDelegate.loop(true);
                    $ionicSlideBoxDelegate.update();
                } else {
                    Tips.showTips(data.msg)
                }
            })
        }
        $scope.getBanners();        
    }]);
});

