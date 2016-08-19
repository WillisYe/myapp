define([
  'app'
],function (app) {
    app    
    .directive('dmCounter', ['$interval', function($interval) {
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
            link: function(scope, iElm, iAttrs, controller) {
                function init() {
                    scope.day = '0';
                    scope.hour = '0';
                    scope.minute = '0';
                    scope.second = '0';
                }
                function caculateTime(enddate) {
                    if(enddate.length >= 13){
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
                scope.$watch('enddate', function(newValue, oldValue) {
                    if (newValue == '') return;
                    caculateTime(newValue)
                    scope.interval = $interval(function() {
                        caculateTime(newValue)
                    }, 1000)
                })

                scope.$on('$destroy', function() {
                    $interval.cancel(scope.interval);
                });
            }
        };
    }])
})