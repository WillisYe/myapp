define([
  'app'
],function (app) {
    app

   
    .directive("dmDatePicker", function() {
        return {
            restrict: 'EAC',
            replace: false,
            scope:{
                dateok:'@',
                okcallback:'&',
                notokcallback:'&'
             },
             template:'<div class="dm-date-picker-c">'+
                           '<p class="title">{{year}}年{{month < 10 ? "0"+month : month}}月</p>'+
                           '<div class="row-date">'+
                               '<div class="date-item week" ng-repeat="w in week">{{::w}}</div>'+
                              
                           '</div>'+
                           '<div class="row-date" ng-repeat="seven in allDay">'+
                              '<div class="date-item" ng-repeat="day in seven" ng-click="selectDay(day)">'+
                                     '{{::day.day}}'+
                                   '<div class="can-book-wrap" ng-if="day.ok">'+
                                       '<i class="can-book"></i>'+
                                   '</div>'+
                                   '<i class="month" ng-if="day.day == 1 && day.month != month">{{::day.month}}月</i>'+
                               '</div>'+
                             
                           '</div>'+
                            '<div class="tips"><i class="can-book"></i>&nbsp;&nbsp;可预约</div>'+
                       '</div> ',
                         link: function(scope, iElm, iAttrs, controller) {
                             scope.monthDay = function(year,month) {
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
                                         if((year%4==0 && year%100!=0)||(year%400==0)) {
                                             return 29; 
                                         }
                                         return 28; 
                                     }
                                 }
                             }
                             scope.getAllDay = function(dateok,year,month,day) {
                                var temp = [];
                                 var allDay = [];
                                 for(i = 0;i < 28;i++) {
                                     if(dateok.indexOf(''+ year + '-' + month + '-' + day) > -1) {
                                         temp.push({
                                             year:year,
                                             month:month,
                                             day:day,
                                             ok:true
                                         });
                                     } else {
                                         temp.push({
                                             year:year,
                                             month:month,
                                             day:day,
                                             ok:false
                                         });
                                     }
                                     
                                     ++day;
                                     if( (i + 1) % 7 == 0) {
                                         allDay.push(temp);
                                         temp = [];
                                     }
                                     if(day > monthDay) {
                                         if(month == 12) {
                                             month = 1;
                                             ++year
                                         } else {
                                             ++month;
                                         }
                                         
                                         day = 1;
                                     }

                                 }
                                 return allDay;
                             }
                             var dateok = scope.dateok = scope.dateok || [];
                             var date = new Date();
                             var year = scope.year = date.getFullYear();
                             var month = scope.month = date.getMonth() + 1;
                             var day = date.getDate();
                             scope.week = [];
                             var week = ['日','一','二','三','四','五','六'];
                             var weekIndex = date.getDay();
                             for (var i = weekIndex; i < 7; i++) {
                                 scope.week.push(week[i]);
                             }
                             for(i = 0;i < weekIndex;i++) {
                                 scope.week.push(week[i]);
                             }
                             var monthDay = scope.monthDay(year,month);
                             
                             scope.allDay = scope.getAllDay(dateok,year,month,day);
                             //监听可预约的数据变化，更新界面
                             scope.$watch('dateok', function(newValue, oldValue) {
                               scope.allDay = scope.getAllDay(newValue,year,month,day);
                             });

                             scope.selectDay = function(day) {
                                 if(day.ok) {  //可预约
                                     // alert('可预约，执行回调函数')
                                     if(angular.isFunction(scope.okcallback)) {
                                         scope.okcallback({day:day});
                                     }
                                 } else { //不可预约
                                     // alert('不可预约，执行回调函数')
                                     if(angular.isFunction(scope.notokcallback)) {
                                         scope.notokcallback({day:day});
                                     }
                                 }
                            }
                             
                           
                             
                            
                        }
        }
     })

    .directive('dmCloseBackDrop', [function() {
        return {
            scope: false,
            restrict: 'A',
            replace: false,
            link: function(scope, iElm, iAttrs, controller) {
                var htmlEl = angular.element(document.querySelector('html'));
                htmlEl.on("click", function(event) {
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

    
   

  
})