define(['app', 'js/utils/tips', 'js/directives/dmNum'], function (app, Tips) {
    app.controller('jsCtrl', ['$scope', '$ionicHistory', 'httpRequest', '$ionicSlideBoxDelegate', '$state', function ($scope, $ionicHistory, httpRequest, $ionicSlideBoxDelegate, $state) {
            $scope.feedback = function () {
                var uid = localStorage.getItem('uid');
                if (uid) {
                    $state.go('feedback');
                }
                else {
                    $state.go('login');
                }
            };
        }]);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90cy9jb250cm9sbGVycy9qcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsZUFBZSxFQUFFLHFCQUFxQixDQUFDLEVBQUMsVUFBVSxHQUFHLEVBQUUsSUFBSTtJQUN0RSxHQUFHLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsRUFBRSxlQUFlLEVBQUUsYUFBYSxFQUFFLHdCQUF3QixFQUFFLFFBQVEsRUFBRSxVQUFTLE1BQU0sRUFBRSxhQUFhLEVBQUUsV0FBVyxFQUFFLHNCQUFzQixFQUFFLE1BQU07WUFDL0ssTUFBTSxDQUFDLFFBQVEsR0FBRztnQkFDZCxJQUFJLEdBQUcsR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUN0QyxFQUFFLENBQUEsQ0FBQyxHQUFHLENBQUMsQ0FBQSxDQUFDO29CQUNKLE1BQU0sQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQzFCLENBQUM7Z0JBQUEsSUFBSSxDQUFBLENBQUM7b0JBQ0YsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDdkIsQ0FBQztZQUNMLENBQUMsQ0FBQTtRQUNMLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDUixDQUFDLENBQUMsQ0FBQyJ9