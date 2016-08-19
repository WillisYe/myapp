
define(['app', 'js/utils/tips', 'js/directives/dmNum'],function (app, Tips) {
    app.controller('htmlCtrl', ['$scope', '$ionicHistory', 'httpRequest', '$ionicSlideBoxDelegate', htmlCtrl]);

    function htmlCtrl($scope, $ionicHistory, httpRequest, $ionicSlideBoxDelegate){
        $scope.navs = [];
        $scope.init = () => {
            $scope.navs = [
                {url: '#/toastr', name: 'toastr' },
                {url: '#/test', name: 'fusioncharts' },
                {url: '#/es6', name: 'es6' },
            ]
        }
        $scope.init();
    }
});
    
