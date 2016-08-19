
define(['app', 'js/utils/tips', 'js/directives/dmNum'],function (app, Tips) {
    app.controller('jsCtrl', ['$scope', '$ionicHistory', 'httpRequest', '$ionicSlideBoxDelegate', '$state', function($scope, $ionicHistory, httpRequest, $ionicSlideBoxDelegate, $state) {
        $scope.feedback = () => {
            var uid = localStorage.getItem('uid');
            if(uid){
                $state.go('feedback');
            }else{
                $state.go('login');
            }
        }
    }]);
});
    
