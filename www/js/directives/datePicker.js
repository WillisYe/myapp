define([
    'app'
], function (app) {
    app
        .directive("dmDatePicker", function () {
        return {
            restrict: 'EAC',
            replace: false,
            scope: {
                dateok: '@',
                okcallback: '&',
                notokcallback: '&'
            },
            template: '<div class="dm-date-picker-c">' +
                '<p class="title">{{year}}年{{month < 10 ? "0"+month : month}}月</p>' +
                '<div class="row-date">' +
                '<div class="date-item week" ng-repeat="w in week">{{::w}}</div>' +
                '</div>' +
                '<div class="row-date" ng-repeat="seven in allDay">' +
                '<div class="date-item" ng-repeat="day in seven" ng-click="selectDay(day)">' +
                '{{::day.day}}' +
                '<div class="can-book-wrap" ng-if="day.ok">' +
                '<i class="can-book"></i>' +
                '</div>' +
                '<i class="month" ng-if="day.day == 1 && day.month != month">{{::day.month}}月</i>' +
                '</div>' +
                '</div>' +
                '<div class="tips"><i class="can-book"></i>&nbsp;&nbsp;可预约</div>' +
                '</div> ',
            link: function (scope, iElm, iAttrs, controller) {
                scope.monthDay = function (year, month) {
                    switch (month) {
                        case 1:
                        case 3:
                        case 5:
                        case 7:
                        case 8:
                        case 10:
                        case 12:
                            return 31;
                        case 4:
                        case 6:
                        case 9:
                        case 11:
                            return 30;
                        default: {
                            if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
                                return 29;
                            }
                            return 28;
                        }
                    }
                };
                scope.getAllDay = function (dateok, year, month, day) {
                    var temp = [];
                    var allDay = [];
                    for (i = 0; i < 28; i++) {
                        if (dateok.indexOf('' + year + '-' + month + '-' + day) > -1) {
                            temp.push({
                                year: year,
                                month: month,
                                day: day,
                                ok: true
                            });
                        }
                        else {
                            temp.push({
                                year: year,
                                month: month,
                                day: day,
                                ok: false
                            });
                        }
                        ++day;
                        if ((i + 1) % 7 == 0) {
                            allDay.push(temp);
                            temp = [];
                        }
                        if (day > monthDay) {
                            if (month == 12) {
                                month = 1;
                                ++year;
                            }
                            else {
                                ++month;
                            }
                            day = 1;
                        }
                    }
                    return allDay;
                };
                var dateok = scope.dateok = scope.dateok || [];
                var date = new Date();
                var year = scope.year = date.getFullYear();
                var month = scope.month = date.getMonth() + 1;
                var day = date.getDate();
                scope.week = [];
                var week = ['日', '一', '二', '三', '四', '五', '六'];
                var weekIndex = date.getDay();
                for (var i = weekIndex; i < 7; i++) {
                    scope.week.push(week[i]);
                }
                for (i = 0; i < weekIndex; i++) {
                    scope.week.push(week[i]);
                }
                var monthDay = scope.monthDay(year, month);
                scope.allDay = scope.getAllDay(dateok, year, month, day);
                //监听可预约的数据变化，更新界面
                scope.$watch('dateok', function (newValue, oldValue) {
                    scope.allDay = scope.getAllDay(newValue, year, month, day);
                });
                scope.selectDay = function (day) {
                    if (day.ok) {
                        // alert('可预约，执行回调函数')
                        if (angular.isFunction(scope.okcallback)) {
                            scope.okcallback({ day: day });
                        }
                    }
                    else {
                        // alert('不可预约，执行回调函数')
                        if (angular.isFunction(scope.notokcallback)) {
                            scope.notokcallback({ day: day });
                        }
                    }
                };
            }
        };
    })
        .directive('dmCloseBackDrop', [function () {
            return {
                scope: false,
                restrict: 'A',
                replace: false,
                link: function (scope, iElm, iAttrs, controller) {
                    var htmlEl = angular.element(document.querySelector('html'));
                    htmlEl.on("click", function (event) {
                        if (event.target.nodeName === "HTML" &&
                            scope.popup.optionsPopup &&
                            scope.popup.isPopup) {
                            scope.popup.optionsPopup.close();
                            scope.popup.isPopup = false;
                        }
                    });
                }
            };
        }]);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZVBpY2tlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3RzL2RpcmVjdGl2ZXMvZGF0ZVBpY2tlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLENBQUM7SUFDTCxLQUFLO0NBQ04sRUFBQyxVQUFVLEdBQUc7SUFDWCxHQUFHO1NBR0YsU0FBUyxDQUFDLGNBQWMsRUFBRTtRQUN2QixNQUFNLENBQUM7WUFDSCxRQUFRLEVBQUUsS0FBSztZQUNmLE9BQU8sRUFBRSxLQUFLO1lBQ2QsS0FBSyxFQUFDO2dCQUNGLE1BQU0sRUFBQyxHQUFHO2dCQUNWLFVBQVUsRUFBQyxHQUFHO2dCQUNkLGFBQWEsRUFBQyxHQUFHO2FBQ25CO1lBQ0QsUUFBUSxFQUFDLGdDQUFnQztnQkFDM0IsbUVBQW1FO2dCQUNuRSx3QkFBd0I7Z0JBQ3BCLGlFQUFpRTtnQkFFckUsUUFBUTtnQkFDUixvREFBb0Q7Z0JBQ2pELDRFQUE0RTtnQkFDckUsZUFBZTtnQkFDakIsNENBQTRDO2dCQUN4QywwQkFBMEI7Z0JBQzlCLFFBQVE7Z0JBQ1Isa0ZBQWtGO2dCQUN0RixRQUFRO2dCQUVaLFFBQVE7Z0JBQ1AsaUVBQWlFO2dCQUN0RSxTQUFTO1lBQ1AsSUFBSSxFQUFFLFVBQVMsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsVUFBVTtnQkFDMUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxVQUFTLElBQUksRUFBQyxLQUFLO29CQUNoQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO3dCQUNaLEtBQUssQ0FBQyxDQUFDO3dCQUNQLEtBQUssQ0FBQyxDQUFDO3dCQUNQLEtBQUssQ0FBQyxDQUFDO3dCQUNQLEtBQUssQ0FBQyxDQUFDO3dCQUNQLEtBQUssQ0FBQyxDQUFDO3dCQUNQLEtBQUssRUFBRSxDQUFDO3dCQUNSLEtBQUssRUFBRTs0QkFDSCxNQUFNLENBQUMsRUFBRSxDQUFDO3dCQUNkLEtBQUssQ0FBQyxDQUFDO3dCQUNQLEtB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