define(['app', 'js/utils/tips', 'js/directives/dmNum'], function (app, Tips) {
    app.controller('htmlCtrl', ['$scope', '$ionicHistory', 'httpRequest', '$ionicSlideBoxDelegate', htmlCtrl]);
    function htmlCtrl($scope, $ionicHistory, httpRequest, $ionicSlideBoxDelegate) {
        $scope.navs = [];
        $scope.init = function () {
            $scope.navs = [
                { url: '#/toastr', name: 'toastr' },
                { url: '#/test', name: 'fusioncharts' },
                { url: '#/es6', name: 'es6' },
            ];
        };
        $scope.init();
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRtbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3RzL2NvbnRyb2xsZXJzL2h0bWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFLGVBQWUsRUFBRSxxQkFBcUIsQ0FBQyxFQUFDLFVBQVUsR0FBRyxFQUFFLElBQUk7SUFDdEUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxRQUFRLEVBQUUsZUFBZSxFQUFFLGFBQWEsRUFBRSx3QkFBd0IsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBRTNHLGtCQUFrQixNQUFNLEVBQUUsYUFBYSxFQUFFLFdBQVcsRUFBRSxzQkFBc0I7UUFDeEUsTUFBTSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7UUFDakIsTUFBTSxDQUFDLElBQUksR0FBRztZQUNWLE1BQU0sQ0FBQyxJQUFJLEdBQUc7Z0JBQ1YsRUFBQyxHQUFHLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUU7Z0JBQ2xDLEVBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFO2dCQUN0QyxFQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRTthQUMvQixDQUFBO1FBQ0wsQ0FBQyxDQUFBO1FBQ0QsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2xCLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9