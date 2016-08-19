/**
 * Created by qinliduan on 16/3/29.
 */

/**
 * 示例
 * <view-sign date-list="{{signList}}"></view-sign>
 */
define(['app'], function(app) {


    app.directive('viewSign', [
        function() {
            return {
                restrict: 'E',
                replace: false,
                scope: {
                    dateList: '@'
                },
                templateUrl: function(elem, attr) {
                    return "components/view-sign/view_sign.html";
                },
                compile: function(tElm, tAttrs, transclude) {
                    return {
                        pre: function preLink(scope, iElement, iAttrs, controller) {

                        },
                        post: function postLink(scope, iElement, iAttrs, controller) {
                            var date = new Date();
                            var year = scope.year = date.getFullYear();
                            var month = scope.month = date.getMonth() + 1;
                            var day = scope.day = date.getDate();
                            scope.nowDay = day < 10 ? '0' + day : day;
                            //监听数据变化，更新界面
                            scope.$watch('dateList', function(newValue, oldValue) {
                                newValue = newValue || JSON.stringify([]);
                                var texts = scope.signList = JSON.parse(newValue);
                                scope.allDay = getAllDay(newValue, year, month, day);
                            });

                            function getAllDay(dateList, year, month, day) {
                                var monthDay = getMonthDay(year, month);
                                month = month < 10 ? '0' + month : month;
                                var firstDayWeekIndex = getWeekIndex('' + year + '-' + month + '-01');
                                var weekDay = [],
                                    i, len;
                                for (i = 0; i < firstDayWeekIndex; i++) {
                                    weekDay.push({
                                        year: '',
                                        month: '',
                                        day: '',
                                        sign: false
                                    });
                                }
                                var signList = scope.signList;
                                var temp;
                                var allDay = [];
                                for (i = 1; i <= monthDay; i++) {
                                    temp = i < 10 ? '0' + i : i;
                                    if (signList.indexOf('' + year + '-' + month + '-' + temp) > -1) {
                                        weekDay.push({
                                            year: year,
                                            month: month,
                                            day: temp,
                                            sign: true
                                        });
                                    } else {
                                        weekDay.push({
                                            year: year,
                                            month: month,
                                            day: temp,
                                            sign: false
                                        });
                                    }

                                    if ((firstDayWeekIndex + i) % 7 == 0) {
                                        allDay.push(weekDay);
                                        weekDay = [];
                                    }

                                }
                                len = weekDay.length;
                                if (len > 0) {
                                    for (i = len; i < 7; i++) {
                                        weekDay.push({
                                            year: '',
                                            month: '',
                                            day: '',
                                            sign: false
                                        });
                                    }
                                    allDay.push(weekDay);
                                }

                                return allDay;
                            }
                            //返回星期几的索引
                            function getWeekIndex(day) {
                                var date = new Date(day);
                                return date.getDay();
                            }
                            //返回每月有多少天
                            function getMonthDay(year, month) {
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
                                    default:
                                        {
                                            if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
                                                return 29;
                                            }
                                            return 28;
                                        }
                                }
                            }
                        }
                    }


                }
            }
        }
    ]);
});
