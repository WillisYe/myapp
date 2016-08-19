define([
    'app'
], function (app) {
    app
        .directive('dmCounter', ['$interval', function ($interval) {
            return {
                scope: {
                    enddate: '@'
                },
                restrict: 'EAC',
                replace: false,
                template: '<div class="dm-counter-time">' +
                    '<span class="d">{{day < 10 ? "0" + day : day}}</span>' +
                    '<span class="dot">:</span>' +
                    '<span class="h">{{hour < 10 ? "0" + hour : hour}}</span>' +
                    '<span class="dot">:</span>' +
                    '<span class="m">{{minute < 10 ? "0" + minute : minute}}</span>' +
                    '<span class="dot">:</span>' +
                    '<span class="s">{{second < 10 ? "0" + second : second}}</span>' +
                    '</div>',
                link: function (scope, iElm, iAttrs, controller) {
                    function init() {
                        scope.day = '0';
                        scope.hour = '0';
                        scope.minute = '0';
                        scope.second = '0';
                    }
                    function caculateTime(enddate) {
                        if (enddate.length >= 13) {
                            enddate = Math.round(enddate / 1000);
                        }
                        var nowTime = Math.round(new Date().getTime() / 1000);
                        var diffTime = enddate - nowTime;
                        if (diffTime < 0) {
                            init();
                            angular.isDefined(scope.interval) && $interval.cancel(scope.interval);
                            return;
                        }
                        var day = scope.day = Math.floor(diffTime / (24 * 60 * 60));
                        diffTime = diffTime - day * (24 * 60 * 60);
                        var hour = scope.hour = Math.floor(diffTime / (60 * 60));
                        diffTime = diffTime - hour * (60 * 60);
                        var minute = scope.minute = Math.floor(diffTime / 60);
                        scope.second = diffTime - minute * 60;
                    }
                    init();
                    scope.$watch('enddate', function (newValue, oldValue) {
                        if (newValue == '')
                            return;
                        caculateTime(newValue);
                        scope.interval = $interval(function () {
                            caculateTime(newValue);
                        }, 1000);
                    });
                    scope.$on('$destroy', function () {
                        $interval.cancel(scope.interval);
                    });
                }
            };
        }]);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG1Db3VudGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdHMvZGlyZWN0aXZlcy9kbUNvdW50ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxDQUFDO0lBQ0wsS0FBSztDQUNOLEVBQUMsVUFBVSxHQUFHO0lBQ1gsR0FBRztTQUNGLFNBQVMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxXQUFXLEVBQUUsVUFBUyxTQUFTO1lBQ3BELE1BQU0sQ0FBQztnQkFDSCxLQUFLLEVBQUU7b0JBQ0gsT0FBTyxFQUFFLEdBQUc7aUJBQ2Y7Z0JBQ0QsUUFBUSxFQUFFLEtBQUs7Z0JBQ2YsT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsUUFBUSxFQUFFLCtCQUErQjtvQkFDckMsdURBQXVEO29CQUN2RCw0QkFBNEI7b0JBQzVCLDBEQUEwRDtvQkFDMUQsNEJBQTRCO29CQUM1QixnRUFBZ0U7b0JBQ2hFLDRCQUE0QjtvQkFDNUIsZ0VBQWdFO29CQUNoRSxRQUFRO2dCQUNaLElBQUksRUFBRSxVQUFTLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFVBQVU7b0JBQzFDO3dCQUNJLEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO3dCQUNoQixLQUFLLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQzt3QkFDakIsS0FBSyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7d0JBQ25CLEtBQUssQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO29CQUN2QixDQUFDO29CQUNELHNCQUFzQixPQUFPO3dCQUN6QixFQUFFLENBQUEsQ0FBQyxPQUFPLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQyxDQUFBLENBQUM7NEJBQ3JCLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsQ0FBQzt3QkFDekMsQ0FBQzt3QkFDRCxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7d0JBQ3RELElBQUksUUFBUSxHQUFHLE9BQU8sR0FBRyxPQUFPLENBQUM7d0JBQ2pDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUNmLElBQUksRUFBRSxDQUFDOzRCQUNQLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDOzRCQUN0RSxNQUFNLENBQUM7d0JBQ1gsQ0FBQzt3QkFDRCxJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUM1RCxRQUFRLEdBQUcsUUFBUSxHQUFHLEdBQUcsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7d0JBQzNDLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDekQsUUFBUSxHQUFHLFFBQVEsR0FBRyxJQUFJLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7d0JBQ3ZDLElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDLENBQUM7d0JBQ3RELEtBQUssQ0FBQyxNQUFNLEdBQUcsUUFBUSxHQUFHLE1BQU0sR0FBRyxFQUFFLENBQUM7b0JBQzFDLENBQUM7b0JBQ0QsSUFBSSxFQUFFLENBQUM7b0JBQ1AsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsVUFBUyxRQUFRLEVBQUUsUUFBUTt3QkFDL0MsRUFBRSxDQUFDLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQzs0QkFBQyxNQUFNLENBQUM7d0JBQzNCLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQTt3QkFDdEIsS0FBSyxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUM7NEJBQ3ZCLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQTt3QkFDMUIsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFBO29CQUNaLENBQUMsQ0FBQyxDQUFBO29CQUVGLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFO3dCQUNsQixTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDckMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsQ0FBQzthQUNKLENBQUM7UUFDTixDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ1AsQ0FBQyxDQUFDLENBQUEifQ==