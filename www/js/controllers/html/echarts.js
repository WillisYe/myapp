define(['app', 'js/utils/tips', 'fusion', 'fusioncharts', 'fusionchartstheme'], function (app, Tips) {
    app.controller('echartsCtrl', ['$scope', '$ionicHistory', 'httpRequest', '$ionicSlideBoxDelegate', '$sce', '$cordovaInAppBrowser', function ($scope, $ionicHistory, httpRequest, $ionicSlideBoxDelegate, $sce, $cordovaInAppBrowser) {
            FusionCharts.ready(function () {
                var revenueChart = new FusionCharts({
                    "type": "column2d",
                    "renderAt": "chartContainer",
                    "width": "100%",
                    "height": "300",
                    "dataFormat": "json",
                    "dataSource": {
                        "chart": {
                            "caption": "Monthly revenue for last year",
                            "subCaption": "Harry's SuperMart",
                            "xAxisName": "Month",
                            "yAxisName": "Revenues (In USD)",
                            "theme": "fint"
                        },
                        "data": [
                            {
                                "label": "Jan",
                                "value": "420000"
                            },
                            {
                                "label": "Feb",
                                "value": "810000"
                            },
                            {
                                "label": "Mar",
                                "value": "720000"
                            },
                            {
                                "label": "Apr",
                                "value": "550000"
                            },
                            {
                                "label": "May",
                                "value": "910000"
                            },
                            {
                                "label": "Jun",
                                "value": "510000"
                            },
                            {
                                "label": "Jul",
                                "value": "680000"
                            },
                            {
                                "label": "Aug",
                                "value": "620000"
                            },
                            {
                                "label": "Sep",
                                "value": "610000"
                            },
                            {
                                "label": "Oct",
                                "value": "490000"
                            },
                            {
                                "label": "Nov",
                                "value": "900000"
                            },
                            {
                                "label": "Dec",
                                "value": "730000"
                            }
                        ]
                    }
                });
                revenueChart.render();
            });
            $scope.goBack = function () {
                $ionicHistory.goBack();
            };
        }]);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNoYXJ0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3RzL2NvbnRyb2xsZXJzL2h0bWwvZWNoYXJ0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsZUFBZSxFQUFFLFFBQVEsRUFBRSxjQUFjLEVBQUUsbUJBQW1CLENBQUMsRUFBRSxVQUFVLEdBQUcsRUFBRSxJQUFJO0lBQy9GLEdBQUcsQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFLENBQUMsUUFBUSxFQUFFLGVBQWUsRUFBRSxhQUFhLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSxFQUFFLHNCQUFzQixFQUFFLFVBQVUsTUFBTSxFQUFFLGFBQWEsRUFBRSxXQUFXLEVBQUUsc0JBQXNCLEVBQUUsSUFBSSxFQUFFLG9CQUFvQjtZQUMvTixZQUFZLENBQUMsS0FBSyxDQUFDO2dCQUNmLElBQUksWUFBWSxHQUFHLElBQUksWUFBWSxDQUFDO29CQUNoQyxNQUFNLEVBQUUsVUFBVTtvQkFDbEIsVUFBVSxFQUFFLGdCQUFnQjtvQkFDNUIsT0FBTyxFQUFFLE1BQU07b0JBQ2YsUUFBUSxFQUFFLEtBQUs7b0JBQ2YsWUFBWSxFQUFFLE1BQU07b0JBQ3BCLFlBQVksRUFBRTt3QkFDVixPQUFPLEVBQUU7NEJBQ0wsU0FBUyxFQUFFLCtCQUErQjs0QkFDMUMsWUFBWSxFQUFFLG1CQUFtQjs0QkFDakMsV0FBVyxFQUFFLE9BQU87NEJBQ3BCLFdBQVcsRUFBRSxtQkFBbUI7NEJBQ2hDLE9BQU8sRUFBRSxNQUFNO3lCQUNsQjt3QkFDRCxNQUFNLEVBQUU7NEJBQ0o7Z0NBQ0ksT0FBTyxFQUFFLEtBQUs7Z0NBQ2QsT0FBTyxFQUFFLFFBQVE7NkJBQ3BCOzRCQUNEO2dDQUNJLE9BQU8sRUFBRSxLQUFLO2dDQUNkLE9BQU8sRUFBRSxRQUFROzZCQUNwQjs0QkFDRDtnQ0FDSSxPQUFPLEVBQUUsS0FBSztnQ0FDZCxPQUFPLEVBQUUsUUFBUTs2QkFDcEI7NEJBQ0Q7Z0NBQ0ksT0FBTyxFQUFFLEtBQUs7Z0NBQ2QsT0FBTyxFQUFFLFFBQVE7NkJBQ3BCOzRCQUNEO2dDQUNJLE9BQU8sRUFBRSxLQUFLO2dDQUNkLE9BQU8sRUFBRSxRQUFROzZCQUNwQjs0QkFDRDtnQ0FDSSxPQUFPLEVBQUUsS0FBSztnQ0FDZCxPQUFPLEVBQUUsUUFBUTs2QkFDcEI7NEJBQ0Q7Z0NBQ0ksT0FBTyxFQUFFLEtBQUs7Z0NBQ2QsT0FBTyxFQUFFLFFBQVE7NkJBQ3BCOzRCQUNEO2dDQUNJLE9BQU8sRUFBRSxLQUFLO2dDQUNkLE9BQU8sRUFBRSxRQUFROzZCQUNwQjs0QkFDRDtnQ0FDSSxPQUFPLEVBQUUsS0FBSztnQ0FDZCxPQUFPLEVBQUUsUUFBUTs2QkFDcEI7NEJBQ0Q7Z0NBQ0ksT0FBTyxFQUFFLEtBQUs7Z0NBQ2QsT0FBTyxFQUFFLFFBQVE7NkJBQ3BCOzRCQUNEO2dDQUNJLE9BQU8sRUFBRSxLQUFLO2dDQUNkLE9BQU8sRUFBRSxRQUFROzZCQUNwQjs0QkFDRDtnQ0FDSSxPQUFPLEVBQUUsS0FBSztnQ0FDZCxPQUFPLEVBQUUsUUFBUTs2QkFDcEI7eUJBQ0o7cUJBQ0o7aUJBQ0osQ0FBQyxDQUFDO2dCQUVILFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUMxQixDQUFDLENBQUMsQ0FBQTtZQUVGLE1BQU0sQ0FBQyxNQUFNLEdBQUc7Z0JBQ1osYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFBO1lBQzFCLENBQUMsQ0FBQTtRQUNMLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDUixDQUFDLENBQUMsQ0FBQyJ9