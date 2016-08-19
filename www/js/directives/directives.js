define([
    'app'
], function (app) {
    app
        .directive('dmImagesScan', ['$ionicGesture', '$ionicPopup', '$compile', '$ionicSlideBoxDelegate', '$timeout', '$ionicPosition',
        function ($ionicGesture, $ionicPopup, $compile, $ionicSlideBoxDelegate, $timeout, $ionicPosition) {
            return {
                scope: {},
                restrict: 'AC',
                replace: false,
                link: function (scope, iElm, iAttrs, controller) {
                    var children = iElm.children();
                    var src_array = [];
                    var temp_element = '';
                    var imagesScanId = 'imagesScanId_' + (+new Date()) + parseInt(Math.random() * 9999 + 1);
                    for (var i = 0, len = children.length; i < len; i++) {
                        if (children[i].tagName == 'IMG') {
                            temp_element = angular.element(children[i]);
                            temp_element.attr({
                                'dm-scan-img-private': 'true',
                                'dm-scan-img-index': i
                            });
                            src_array.push({ data_src: temp_element.attr('data-src'), src: temp_element.attr('src') });
                        }
                    }
                    scope.src_array = src_array;
                    $ionicGesture.on("tap", function (e) {
                        var target = angular.element(e.target);
                        if (target.attr('dm-scan-img-private')) {
                            var img_wrap = document.querySelector('#' + imagesScanId);
                            var index = target.attr('dm-scan-img-index');
                            if (img_wrap) {
                                scope.slideHasChanged(index);
                                $ionicSlideBoxDelegate.$getByHandle(imagesScanId).slide(index, 100);
                                angular.element(scope.img_wrap).removeClass('ng-hide');
                            }
                            else {
                                var tpl = '<div class="dm-images-scan-item-wrap "  ng-click="hideWrap()"  id="' + imagesScanId + '" >' +
                                    '<ion-slide-box delegate-handle="' + imagesScanId + '" on-slide-changed="slideHasChanged($index)">' +
                                    '<ion-slide ng-repeat="img in src_array" >' +
                                    '<img data-lzsrc="{{::img.data_src}}"  ng-src="{{::img.src}}" ng-click="stopPropagation($event)" >' +
                                    '</ion-slide>' +
                                    '</ion-slide-box >' +
                                    '</div>';
                                tpl = angular.element(tpl);
                                angular.element(document.body).append(tpl);
                                $compile(tpl)(scope);
                                scope.img_wrap = document.querySelector('#' + imagesScanId);
                                $timeout(function () {
                                    scope.slideHasChanged(index);
                                    $ionicSlideBoxDelegate.$getByHandle(imagesScanId).slide(index, 100);
                                    // var ImagesZoom = new ImagesZoom;
                                    // ImagesZoom.init({
                                    //     "elem": '#'+imagesScanId
                                    // });
                                }, 0);
                            }
                        }
                    }, iElm);
                    scope.stopPropagation = function ($event) {
                        $event.stopPropagation();
                    };
                    scope.hideWrap = function () {
                        angular.element(scope.img_wrap).addClass('ng-hide');
                    };
                    scope.slideHasChanged = function (index) {
                        var allImg = angular.element(scope.img_wrap).find('img');
                        var current = angular.element(allImg[index]);
                        var lzsrc = current.attr('data-lzsrc');
                        if (lzsrc && current.attr('src') != lzsrc) {
                            current.css('opacity', '0.7');
                            var img = document.createElement("img");
                            img.src = lzsrc;
                            img.onload = function () {
                                current.css('opacity', '1');
                                current.attr('src', lzsrc);
                            };
                        }
                    };
                }
            };
        }])
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
        }])
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
        .directive('dmHoldActive', ['$ionicGesture', '$timeout', '$ionicBackdrop',
        function ($ionicGesture, $timeout, $ionicBackdrop) {
            return {
                scope: false,
                restrict: 'A',
                replace: false,
                link: function (scope, iElm, iAttrs, controller) {
                    $ionicGesture.on("hold", function () {
                        iElm.addClass('active');
                        $timeout(function () {
                            iElm.removeClass('active');
                        }, 300);
                    }, iElm);
                }
            };
        }
    ])
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
        }])
        .directive('dmPositionMiddle', ['$window', function ($window) {
            return {
                replace: false,
                link: function (scope, iElm, iAttrs, controller) {
                    var height = $window.innerHeight - 44 - 49 - iElm[0].offsetHeight;
                    if (height >= 0) {
                        iElm[0].style.top = (height / 2 + 44) + 'px';
                    }
                    else {
                        iElm[0].style.top = 44 + 'px';
                    }
                }
            };
        }]);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0aXZlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3RzL2RpcmVjdGl2ZXMvZGlyZWN0aXZlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLENBQUM7SUFDTCxLQUFLO0NBQ04sRUFBQyxVQUFVLEdBQUc7SUFDWCxHQUFHO1NBQ0YsU0FBUyxDQUFDLGNBQWMsRUFBRSxDQUFDLGVBQWUsRUFBQyxhQUFhLEVBQUMsVUFBVSxFQUFDLHdCQUF3QixFQUFDLFVBQVUsRUFBQyxnQkFBZ0I7UUFDckgsVUFBUyxhQUFhLEVBQUMsV0FBVyxFQUFDLFFBQVEsRUFBQyxzQkFBc0IsRUFBQyxRQUFRLEVBQUMsY0FBYztZQUMxRixNQUFNLENBQUM7Z0JBQ0gsS0FBSyxFQUFFLEVBQUU7Z0JBQ1QsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsSUFBSSxFQUFFLFVBQVMsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsVUFBVTtvQkFDMUMsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO29CQUMvQixJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUM7b0JBQ25CLElBQUksWUFBWSxHQUFHLEVBQUUsQ0FBQztvQkFFdEIsSUFBSSxZQUFZLEdBQUksZUFBZSxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBQyxJQUFJLEdBQUMsQ0FBQyxDQUFDLENBQUM7b0JBRXJGLEdBQUcsQ0FBQSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBQyxDQUFDLEdBQUcsR0FBRyxFQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7d0JBQzlDLEVBQUUsQ0FBQSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQzs0QkFDOUIsWUFBWSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQzVDLFlBQVksQ0FBQyxJQUFJLENBQUM7Z0NBQ2QscUJBQXFCLEVBQUUsTUFBTTtnQ0FDN0IsbUJBQW1CLEVBQUUsQ0FBQzs2QkFDekIsQ0FBQyxDQUFDOzRCQUVILFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBQyxRQUFRLEVBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBQyxHQUFHLEVBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBQyxDQUFDLENBQUE7d0JBRXpGLENBQUM7b0JBR0wsQ0FBQztvQkFDRCxLQUFLLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztvQkFFNUIsYUFBYSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsVUFBUyxDQUFDO3dCQUM5QixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQzt3QkFDdkMsRUFBRSxDQUFBLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDcEMsSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEdBQUMsWUFBWSxDQUFDLENBQUM7NEJBQ3hELElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQzs0QkFDN0MsRUFBRSxDQUFBLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQ0FDVixLQUFLLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFBO2dDQUM1QixzQkFBc0IsQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBQyxHQUFHLENBQUMsQ0FBQTtnQ0FDbEUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDOzRCQUMzRCxDQUFDOzRCQUFDLElBQUksQ0FBQyxDQUFDO2dDQUNKLElBQUksR0FBRyxHQUFLLHFFQUFxRSxHQUFDLFlBQVksR0FBQyxLQUFLO29DQUVwRixrQ0FBa0MsR0FBQyxZQUFZLEdBQUMsK0NBQStDO29DQUMzRiwyQ0FBMkM7b0NBQ3ZDLG1HQUFtRztvQ0FDdkcsY0FBYztvQ0FDbEIsbUJBQW1CO29DQUN2QixRQUFRLENBQUE7Z0NBRXBCLEdBQUcsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dDQUMzQixPQUFPLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUE7Z0NBQzFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQ0FDckIsS0FBSyxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsR0FBQyxZQUFZLENBQUMsQ0FBQztnQ0FFMUQsUUFBUSxDQUFDO29DQUNMLEtBQUssQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7b0NBQzdCLHNCQUFzQixDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFDLEdBQUcsQ0FBQyxDQUFDO29DQUNuRSxtQ0FBbUM7b0NBQ25DLG9CQUFvQjtvQ0FDcEIsK0JBQStCO29DQUMvQixNQUFNO2dDQUNWLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs0QkFDVixDQUFDO3dCQUVMLENBQUM7b0JBQ0wsQ0FBQyxFQUFDLElBQUksQ0FBQyxDQUFDO29CQUVSLEtBQUssQ0FBQyxlQUFlLEdBQUcsVUFBUyxNQUFNO3dCQUNuQyxNQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7b0JBQzdCLENBQUMsQ0FBQTtvQkFDRCxLQUFLLENBQUMsUUFBUSxHQUFHO3dCQUNiLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztvQkFDeEQsQ0FBQyxDQUFBO29CQUVELEtBQUssQ0FBQyxlQUFlLEdBQUcsVUFBUyxLQUFLO3dCQUNsQyxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7d0JBQ3pELElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7d0JBQzdDLElBQUksS0FBSyxHQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7d0JBQ3RDLEVBQUUsQ0FBQSxDQUFDLEtBQUssSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUM7NEJBQ3ZDLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDOzRCQUM5QixJQUFJLEdBQUcsR0FBSSxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDOzRCQUN6QyxHQUFHLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQzs0QkFDaEIsR0FBRyxDQUFDLE1BQU0sR0FBRztnQ0FDVCxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQztnQ0FDNUIsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7NEJBQy9CLENBQUMsQ0FBQTt3QkFDTCxDQUFDO29CQUVMLENBQUMsQ0FBQTtnQkFFTCxDQUFDO2FBQ0osQ0FBQztRQUNOLENBQUMsQ0FBQyxDQUFDO1NBQ0YsU0FBUyxDQUFDLFdBQVcsRUFBRSxDQUFDLFdBQVcsRUFBRSxVQUFTLFNBQVM7WUFDcEQsTUFBTSxDQUFDO2dCQUNILEtBQUssRUFBRTtvQkFDSCxPQUFPLEVBQUUsR0FBRztpQkFDZjtnQkFDRCxRQUFRLEVBQUUsS0FBSztnQkFDZixPQUFPLEVBQUUsS0FBSztnQkFDZCxRQUFRLEVBQUUsK0JBQStCO29CQUNyQyx1REFBdUQ7b0JBQ3ZELDRCQUE0QjtvQkFDNUIsMERBQTBEO29CQUMxRCw0QkFBNEI7b0JBQzVCLGdFQUFnRTtvQkFDaEUsNEJBQTRCO29CQUM1QixnRUFBZ0U7b0JBQ2hFLFFBQVE7Z0JBQ1osSUFBSSxFQUFFLFVBQVMsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsVUFBVTtvQkFDMUM7d0JBQ0ksS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7d0JBQ2hCLEtBQUssQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO3dCQUNqQixLQUFLLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQzt3QkFDbkIsS0FBSyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7b0JBQ3ZCLENBQUM7b0JBQ0Qsc0JBQXNCLE9BQU87d0JBQ3pCLEVBQUUsQ0FBQSxDQUFDLE9BQU8sQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDLENBQUEsQ0FBQzs0QkFDckIsT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDO3dCQUN6QyxDQUFDO3dCQUNELElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQzt3QkFDdEQsSUFBSSxRQUFRLEdBQUcsT0FBTyxHQUFHLE9BQU8sQ0FBQzt3QkFDakMsRUFBRSxDQUFDLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ2YsSUFBSSxFQUFFLENBQUM7NEJBQ1AsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7NEJBQ3RFLE1BQU0sQ0FBQzt3QkFDWCxDQUFDO3dCQUNELElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQzVELFFBQVEsR0FBRyxRQUFRLEdBQUcsR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQzt3QkFDM0MsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUN6RCxRQUFRLEdBQUcsUUFBUSxHQUFHLElBQUksR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQzt3QkFDdkMsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUMsQ0FBQzt3QkFDdEQsS0FBSyxDQUFDLE1BQU0sR0FBRyxRQUFRLEdBQUcsTUFBTSxHQUFHLEVBQUUsQ0FBQztvQkFDMUMsQ0FBQztvQkFDRCxJQUFJLEVBQUUsQ0FBQztvQkFDUCxLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxVQUFTLFFBQVEsRUFBRSxRQUFRO3dCQUMvQyxFQUFFLENBQUMsQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDOzRCQUFDLE1BQU0sQ0FBQzt3QkFDM0IsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFBO3dCQUN0QixLQUFLLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQzs0QkFDdkIsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFBO3dCQUMxQixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUE7b0JBQ1osQ0FBQyxDQUFDLENBQUE7b0JBRUYsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUU7d0JBQ2xCLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUNyQyxDQUFDLENBQUMsQ0FBQztnQkFDUCxDQUFDO2FBQ0osQ0FBQztRQUNOLENBQUMsQ0FBQyxDQUFDO1NBRUYsU0FBUyxDQUFDLGNBQWMsRUFBRTtRQUN2QixNQUFNLENBQUM7WUFDSCxRQUFRLEVBQUUsS0FBSztZQUNmLE9BQU8sRUFBRSxLQUFLO1lBQ2QsS0FBSyxFQUFDO2dCQUNGLE1BQU0sRUFBQyxHQUFHO2dCQUNWLFVBQVUsRUFBQyxHQUFHO2dCQUNkLGFBQWEsRUFBQyxHQUFHO2FBQ25CO1lBQ0QsUUFBUSxFQUFDLGdDQUFnQztnQkFDM0IsbUVBQW1FO2dCQUNuRSx3QkFBd0I7Z0JBQ3BCLGlFQUFpRTtnQkFFckUsUUFBUTtnQkFDUixvREFBb0Q7Z0JBQ2pELDRFQUE0RTtnQkFDckUsZUFBZTtnQkFDakIsNENBQTRDO2dCQUN4QywwQkFBMEI7Z0JBQzlCLFFBQVE7Z0JBQ1Isa0ZBQWtGO2dCQUN0RixRQUFRO2dCQUVaLFFBQVE7Z0JBQ1AsaUVBQWlFO2dCQUN0RSxTQUFTO1lBQ1AsSUFBSSxFQUFFLFVBQVMsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsVUFBVTtnQkFDMUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxVQUFTLElBQUksRUFBQyxLQUFLO29CQUNoQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO3dCQUNaLEtBQUssQ0FBQyxDQUFDO3dCQUNQLEtBQUssQ0FBQyxDQUFDO3dCQUNQLEtBQUssQ0FBQyxDQUFDO3dCQUNQLEtBQUssQ0FBQyxDQUFDO3dCQUNQLEtBQUssQ0FBQyxDQUFDO3dCQUNQLEtBQUssRUFBRSxDQUFDO3dCQUNSLEtBQUssRUFBRTs0QkFDSCxNQUFNLENBQUMsRUFBRSxDQUFDO3dCQUNkLEtBQUssQ0FBQyxDQUFDO3dCQUNQLEtBQUssQ0FBQyxDQUFDO3dCQUNQLEtBQUssQ0FBQyxDQUFDO3dCQUNQLEtBQUssRUFBRTs0QkFDSCxNQUFNLENBQUMsRUFBRSxDQUFDO3dCQUNkLFNBQVMsQ0FBQzs0QkFDTixFQUFFLENBQUEsQ0FBQyxDQUFDLElBQUksR0FBQyxDQUFDLElBQUUsQ0FBQyxJQUFJLElBQUksR0FBQyxHQUFHLElBQUUsQ0FBQyxDQUFDLElBQUUsQ0FBQyxJQUFJLEdBQUMsR0FBRyxJQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQ0FDM0MsTUFBTSxDQUFDLEVBQUUsQ0FBQzs0QkFDZCxDQUFDOzRCQUNELE1BQU0sQ0FBQyxFQUFFLENBQUM7d0JBQ2QsQ0FBQztvQkFDTCxDQUFDO2dCQUNMLENBQUMsQ0FBQTtnQkFDRCxLQUFLLENBQUMsU0FBUyxHQUFHLFVBQVMsTUFBTSxFQUFDLElBQUksRUFBQyxLQUFLLEVBQUMsR0FBRztvQkFDN0MsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO29CQUNiLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztvQkFDaEIsR0FBRyxDQUFBLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBQyxDQUFDLEdBQUcsRUFBRSxFQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7d0JBQ25CLEVBQUUsQ0FBQSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxHQUFFLElBQUksR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ3pELElBQUksQ0FBQyxJQUFJLENBQUM7Z0NBQ04sSUFBSSxFQUFDLElBQUk7Z0NBQ1QsS0FBSyxFQUFDLEtBQUs7Z0NBQ1gsR0FBRyxFQUFDLEdBQUc7Z0NBQ1AsRUFBRSxFQUFDLElBQUk7NkJBQ1YsQ0FBQyxDQUFDO3dCQUNQLENBQUM7d0JBQUMsSUFBSSxDQUFDLENBQUM7NEJBQ0osSUFBSSxDQUFDLElBQUksQ0FBQztnQ0FDTixJQUFJLEVBQUMsSUFBSTtnQ0FDVCxLQUFLLEVBQUMsS0FBSztnQ0FDWCxHQUFHLEVBQUMsR0FBRztnQ0FDUCxFQUFFLEVBQUMsS0FBSzs2QkFDWCxDQUFDLENBQUM7d0JBQ1AsQ0FBQzt3QkFFRCxFQUFFLEdBQUcsQ0FBQzt3QkFDTixFQUFFLENBQUEsQ0FBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDbkIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs0QkFDbEIsSUFBSSxHQUFHLEVBQUUsQ0FBQzt3QkFDZCxDQUFDO3dCQUNELEVBQUUsQ0FBQSxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDOzRCQUNoQixFQUFFLENBQUEsQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztnQ0FDYixLQUFLLEdBQUcsQ0FBQyxDQUFDO2dDQUNWLEVBQUUsSUFBSSxDQUFBOzRCQUNWLENBQUM7NEJBQUMsSUFBSSxDQUFDLENBQUM7Z0NBQ0osRUFBRSxLQUFLLENBQUM7NEJBQ1osQ0FBQzs0QkFFRCxHQUFHLEdBQUcsQ0FBQyxDQUFDO3dCQUNaLENBQUM7b0JBRUwsQ0FBQztvQkFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO2dCQUNsQixDQUFDLENBQUE7Z0JBQ0QsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQztnQkFDL0MsSUFBSSxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztnQkFDdEIsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7Z0JBQzNDLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDOUMsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUN6QixLQUFLLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztnQkFDaEIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLENBQUMsQ0FBQztnQkFDekMsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUM5QixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxTQUFTLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO29CQUNqQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDN0IsQ0FBQztnQkFDRCxHQUFHLENBQUEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUMsR0FBRyxTQUFTLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztvQkFDMUIsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzdCLENBQUM7Z0JBQ0QsSUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUMsS0FBSyxDQUFDLENBQUM7Z0JBRTFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUMsSUFBSSxFQUFDLEtBQUssRUFBQyxHQUFHLENBQUMsQ0FBQztnQkFDdEQsaUJBQWlCO2dCQUNqQixLQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxVQUFTLFFBQVEsRUFBRSxRQUFRO29CQUNoRCxLQUFLLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFDLElBQUksRUFBQyxLQUFLLEVBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzFELENBQUMsQ0FBQyxDQUFDO2dCQUVILEtBQUssQ0FBQyxTQUFTLEdBQUcsVUFBUyxHQUFHO29CQUMxQixFQUFFLENBQUEsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDUixzQkFBc0I7d0JBQ3RCLEVBQUUsQ0FBQSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDdEMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDO3dCQUNoQyxDQUFDO29CQUNMLENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ0osdUJBQXVCO3dCQUN2QixFQUFFLENBQUEsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ3pDLEtBQUssQ0FBQyxhQUFhLENBQUMsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQzt3QkFDbkMsQ0FBQztvQkFDTCxDQUFDO2dCQUNOLENBQUMsQ0FBQTtZQUtMLENBQUM7U0FDaEIsQ0FBQTtJQUNKLENBQUMsQ0FBQztTQUNGLFNBQVMsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxlQUFlLEVBQUUsVUFBVSxFQUFFLGdCQUFnQjtRQUNyRSxVQUFTLGFBQWEsRUFBRSxRQUFRLEVBQUUsY0FBYztZQUM1QyxNQUFNLENBQUM7Z0JBQ0gsS0FBSyxFQUFFLEtBQUs7Z0JBQ1osUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsSUFBSSxFQUFFLFVBQVMsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsVUFBVTtvQkFDMUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUU7d0JBQ3JCLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBQ3hCLFFBQVEsQ0FBQzs0QkFDTCxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO3dCQUMvQixDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQ1osQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNiLENBQUM7YUFDSixDQUFDO1FBQ04sQ0FBQztLQUNKLENBQUM7U0FDRCxTQUFTLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztZQUMzQixNQUFNLENBQUM7Z0JBQ0gsS0FBSyxFQUFFLEtBQUs7Z0JBQ1osUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsSUFBSSxFQUFFLFVBQVMsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsVUFBVTtvQkFDMUMsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JBQzdELE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFVBQVMsS0FBSzt3QkFDN0IsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEtBQUssTUFBTTs0QkFDaEMsS0FBSyxDQUFDLEtBQUssQ0FBQyxZQUFZOzRCQUN4QixLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7NEJBQ3RCLEtBQUssQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxDQUFDOzRCQUNqQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7d0JBQ2hDLENBQUM7b0JBQ0wsQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsQ0FBQzthQUNKLENBQUM7UUFDTixDQUFDLENBQUMsQ0FBQztTQUVGLFNBQVMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLFNBQVMsRUFBRSxVQUFTLE9BQU87WUFDdkQsTUFBTSxDQUFBO2dCQUNGLE9BQU8sRUFBRSxLQUFLO2dCQUNkLElBQUksRUFBRSxVQUFTLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFVBQVU7b0JBQzFDLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxXQUFXLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDO29CQUNsRSxFQUFFLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDZCxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDO29CQUNqRCxDQUFDO29CQUFBLElBQUksQ0FBQSxDQUFDO3dCQUNGLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUM7b0JBQ2xDLENBQUM7Z0JBQ0wsQ0FBQzthQUNKLENBQUE7UUFDTCxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBRVAsQ0FBQyxDQUFDLENBQUEifQ==