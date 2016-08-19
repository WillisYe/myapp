define(['app', 'js/utils/tips', 'js/directives/dmNum'], function (app, Tips) {
    app.controller('cssCtrl', ['$scope', '$ionicHistory', 'httpRequest', '$ionicSlideBoxDelegate', '$location', function ($scope, $ionicHistory, httpRequest, $ionicSlideBoxDelegate, $location) {
            $scope.banners = [];
            $scope.getBanners = function () {
                var params = {
                    type: 1
                };
                httpRequest.post('api/?method=other.adList', params, function (xhr, data) {
                    if (data.state === 1) {
                        $scope.banners = data.data;
                        $ionicSlideBoxDelegate.loop(true);
                        $ionicSlideBoxDelegate.update();
                    }
                    else {
                        Tips.showTips(data.msg);
                    }
                });
            };
            $scope.getBanners();
        }]);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3NzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdHMvY29udHJvbGxlcnMvY3NzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE1BQU0sQ0FBQyxDQUFDLEtBQUssRUFBRSxlQUFlLEVBQUUscUJBQXFCLENBQUMsRUFBRSxVQUFVLEdBQUcsRUFBRSxJQUFJO0lBQ3ZFLEdBQUcsQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLENBQUMsUUFBUSxFQUFFLGVBQWUsRUFBRSxhQUFhLEVBQUUsd0JBQXdCLEVBQUUsV0FBVyxFQUFFLFVBQVUsTUFBTSxFQUFFLGFBQWEsRUFBRSxXQUFXLEVBQUUsc0JBQXNCLEVBQUUsU0FBUztZQUN2TCxNQUFNLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztZQUNwQixNQUFNLENBQUMsVUFBVSxHQUFHO2dCQUNoQixJQUFJLE1BQU0sR0FBRztvQkFDVCxJQUFJLEVBQUUsQ0FBQztpQkFDVixDQUFBO2dCQUNELFdBQVcsQ0FBQyxJQUFJLENBQUMsMEJBQTBCLEVBQUUsTUFBTSxFQUFFLFVBQUMsR0FBRyxFQUFFLElBQUk7b0JBQzNELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDbkIsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO3dCQUMzQixzQkFBc0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ2xDLHNCQUFzQixDQUFDLE1BQU0sRUFBRSxDQUFDO29CQUNwQyxDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNKLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO29CQUMzQixDQUFDO2dCQUNMLENBQUMsQ0FBQyxDQUFBO1lBQ04sQ0FBQyxDQUFBO1lBQ0QsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ3hCLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDUixDQUFDLENBQUMsQ0FBQyJ9