define([
  'app'
],function (app) {
    app
    .directive('dmImagesScan', ['$ionicGesture','$ionicPopup','$compile','$ionicSlideBoxDelegate','$timeout','$ionicPosition',
        function($ionicGesture,$ionicPopup,$compile,$ionicSlideBoxDelegate,$timeout,$ionicPosition) {
        return {
            scope: {},
            restrict: 'AC',
            replace: false,
            link: function(scope, iElm, iAttrs, controller) {
                var children = iElm.children();
                var src_array = [];
                var temp_element = '';

                var imagesScanId =  'imagesScanId_' + (+new Date()) + parseInt(Math.random()*9999+1);

                for(var i = 0,len = children.length;i < len;i++) {
                    if(children[i].tagName == 'IMG') {
                        temp_element = angular.element(children[i]);
                        temp_element.attr({
                            'dm-scan-img-private': 'true',
                            'dm-scan-img-index': i
                        });

                        src_array.push({data_src:temp_element.attr('data-src'),src:temp_element.attr('src')})
                        
                    }
                    
                    
                }
                scope.src_array = src_array;

                $ionicGesture.on("tap", function(e) {
                    var target = angular.element(e.target);
                    if(target.attr('dm-scan-img-private')) {   //是要点击放大的img
                        var img_wrap = document.querySelector('#'+imagesScanId);
                        var index = target.attr('dm-scan-img-index');
                        if(img_wrap) {
                            scope.slideHasChanged(index)
                            $ionicSlideBoxDelegate.$getByHandle(imagesScanId).slide(index,100)
                            angular.element(scope.img_wrap).removeClass('ng-hide');
                        } else {
                            var tpl =   '<div class="dm-images-scan-item-wrap "  ng-click="hideWrap()"  id="'+imagesScanId+'" >'+
                                            
                                            '<ion-slide-box delegate-handle="'+imagesScanId+'" on-slide-changed="slideHasChanged($index)">'+
                                                '<ion-slide ng-repeat="img in src_array" >'+
                                                    '<img data-lzsrc="{{::img.data_src}}"  ng-src="{{::img.src}}" ng-click="stopPropagation($event)" >'+
                                                '</ion-slide>'+
                                            '</ion-slide-box >'+
                                        '</div>'
                                        
                            tpl = angular.element(tpl);
                            angular.element(document.body).append(tpl)
                            $compile(tpl)(scope);
                            scope.img_wrap = document.querySelector('#'+imagesScanId);
                           
                            $timeout(function() {
                                scope.slideHasChanged(index);
                                $ionicSlideBoxDelegate.$getByHandle(imagesScanId).slide(index,100);
                                // var ImagesZoom = new ImagesZoom;
                                // ImagesZoom.init({
                                //     "elem": '#'+imagesScanId
                                // });
                            }, 0);
                        }
                        
                    }
                },iElm);
                
                scope.stopPropagation = function($event) {
                    $event.stopPropagation();
                }
                scope.hideWrap = function() {
                    angular.element(scope.img_wrap).addClass('ng-hide');
                }
               
                scope.slideHasChanged = function(index) {
                    var allImg = angular.element(scope.img_wrap).find('img');
                    var current = angular.element(allImg[index]);
                    var lzsrc= current.attr('data-lzsrc');
                    if(lzsrc && current.attr('src') != lzsrc) {
                        current.css('opacity', '0.7');
                        var img =  document.createElement("img"); 
                        img.src = lzsrc;
                        img.onload = function() {
                            current.css('opacity', '1');
                            current.attr('src', lzsrc);
                        }
                    } 
                    
                }

            }
        };
    }])
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
    .directive('dmHoldActive', ['$ionicGesture', '$timeout', '$ionicBackdrop',
        function($ionicGesture, $timeout, $ionicBackdrop) {
            return {
                scope: false,
                restrict: 'A',
                replace: false,
                link: function(scope, iElm, iAttrs, controller) {
                    $ionicGesture.on("hold", function() {
                        iElm.addClass('active');
                        $timeout(function() {
                            iElm.removeClass('active');
                        }, 300);
                    }, iElm);
                }
            };
        }
    ])
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
   
    .directive('dmPositionMiddle', ['$window', function($window){
        return{
            replace: false,
            link: function(scope, iElm, iAttrs, controller){
                var height = $window.innerHeight - 44 - 49 - iElm[0].offsetHeight;
                if (height >= 0) {
                    iElm[0].style.top = (height / 2 + 44) + 'px';
                }else{
                    iElm[0].style.top = 44 + 'px';
                }
            }
        }
    }])
  
})