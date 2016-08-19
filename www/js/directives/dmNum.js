define([
    'app'
], function (app) {
    app
        .directive('dmNum', ['httpRequest', function (httpRequest) {
            return {
                scope: {
                    enddate: '@'
                },
                restrict: 'EAC',
                replace: false,
                templateUrl: 'templates/tpl/dmNum.html',
                link: function (scope, iElm, iAttrs, controller) {
                    function init() {
                        var year = iAttrs.year || new Date().getFullYear();
                        var sx = localStorage.getItem('sx' + year);
                        var wx = localStorage.getItem('wx' + year);
                        if (sx && wx) {
                            scope.sx = JSON.parse(sx);
                            scope.wx = JSON.parse(wx);
                            getData();
                        }
                        else {
                            doPost();
                        }
                    }
                    init();
                    // 获取数字对应的波色0
                    function getColor(num) {
                        var color = {
                            "red": ["01", "02", "07", "08", "12", "13", "18", "19", "23", "24", "29", "30", "34", "35", "40", "45", "46"],
                            "blue": ["03", "04", "09", "10", "14", "15", "20", "25", "26", "31", "36", "37", "41", "42", "47", "48"],
                            "green": ["05", "06", "11", "16", "17", "21", "22", "27", "28", "32", "33", "38", "39", "43", "44", "49"]
                        };
                        for (var index = 0; index < color.red.length; index++) {
                            var val = color.red[index];
                            if (val == num) {
                                return 'red';
                            }
                        }
                        for (var index = 0; index < color.blue.length; index++) {
                            var val = color.blue[index];
                            if (val == num) {
                                return 'blue';
                            }
                        }
                        for (var index = 0; index < color.green.length; index++) {
                            var val = color.green[index];
                            if (val == num) {
                                return 'green';
                            }
                        }
                    }
                    // 获取数字对应的生肖
                    function getSx(num) {
                        for (var index = 0; index < scope.sx.length; index++) {
                            var obj = scope.sx[index];
                            for (var i = 0; i < obj.ball.length; i++) {
                                var val = obj.ball[i].num;
                                if (val == num) {
                                    return obj.sx;
                                }
                            }
                        }
                    }
                    // 获取数字对应的五行
                    function getWx(num) {
                        for (var index = 0; index < scope.wx.length; index++) {
                            var obj = scope.wx[index];
                            for (var i = 0; i < obj.ball.length; i++) {
                                var val = obj.ball[i].num;
                                if (val == num) {
                                    return obj.wx;
                                }
                            }
                        }
                    }
                    function doPost() {
                        var year = new Date().getFullYear();
                        // 获取当年生肖对应的数字
                        httpRequest.post(APP.baseUrl + 'api/?method=lottery.getSxNum', {}, function (xhr, data) {
                            if (data.state) {
                                scope.sx = data.data;
                                localStorage.setItem('sx' + year, JSON.stringify(data.data));
                                // 获取当年的五行对应的数字
                                httpRequest.post(APP.baseUrl + 'api/?method=lottery.getWxNum', {}, function (xhr, data) {
                                    if (data.state) {
                                        scope.wx = data.data;
                                        localStorage.setItem('wx' + year, JSON.stringify(data.data));
                                        getData();
                                    }
                                });
                            }
                        });
                        // 获取波色下的数字
                        // httpRequest.post(APP.baseUrl+'api/?method=lottery.getBs', {}, function(xhr,data){
                        //     scope.color = data.data;
                        // })     
                        // 获取当年的年份和生肖
                        // httpRequest.post(APP.baseUrl+'api/?method=lottery.getSx', {}, function(xhr,data){
                        //     scope.year = data.data;
                        // })
                        // 获取家禽猛兽对应的生肖
                        // httpRequest.post(APP.baseUrl+'api/?method=lottery.getJq', {}, function(xhr,data){
                        //     scope.jq = data.data;
                        // })
                    }
                    function getData() {
                        scope.data = {};
                        var jq = ["牛", "馬", "羊", "雞", "狗", "豬"];
                        var ms = ["鼠", "虎", "兔", "龍", "蛇", "猴"];
                        for (var i = 1; i < 50; i++) {
                            var k = (i < 10) ? ('0' + i) : i;
                            scope.data[k] || (scope.data[k] = {});
                            scope.data[k].color = getColor(k);
                            scope.data[k].wx = getWx(k);
                            scope.data[k].sx = getSx(k);
                            for (var index = 0; index < jq.length; index++) {
                                var val = jq[index];
                                if (val.indexOf(scope.data[k].sx) > -1) {
                                    scope.data[k].jqms = 'jq';
                                }
                            }
                            for (var index = 0; index < ms.length; index++) {
                                var val = ms[index];
                                if (val.indexOf(scope.data[k].sx) > -1) {
                                    scope.data[k].jqms = 'ms';
                                }
                            }
                        }
                        for (var key in scope.data) {
                            if (scope.data.hasOwnProperty(key)) {
                                var val = scope.data[key];
                                if (iAttrs.num === key) {
                                    scope.params = {
                                        num: key,
                                        color: val.color,
                                        wx: val.wx,
                                        sx: val.sx,
                                        jqms: val.jqms
                                    };
                                    scope.dmtype = iAttrs.dmtype;
                                }
                            }
                        }
                    }
                }
            };
        }]);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG1OdW0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90cy9kaXJlY3RpdmVzL2RtTnVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sQ0FBQztJQUNILEtBQUs7Q0FDUixFQUFFLFVBQVUsR0FBRztJQUNaLEdBQUc7U0FDRSxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUMsYUFBYSxFQUFFLFVBQVUsV0FBVztZQUNyRCxNQUFNLENBQUM7Z0JBQ0gsS0FBSyxFQUFFO29CQUNILE9BQU8sRUFBRSxHQUFHO2lCQUNmO2dCQUNELFFBQVEsRUFBRSxLQUFLO2dCQUNmLE9BQU8sRUFBRSxLQUFLO2dCQUNkLFdBQVcsRUFBRSwwQkFBMEI7Z0JBQ3ZDLElBQUksRUFBRSxVQUFVLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFVBQVU7b0JBQzNDO3dCQUNJLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLElBQUksSUFBSSxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQzt3QkFDbkQsSUFBSSxFQUFFLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUM7d0JBQzNDLElBQUksRUFBRSxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDO3dCQUMzQyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQzs0QkFDWCxLQUFLLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7NEJBQzFCLEtBQUssQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQzs0QkFDMUIsT0FBTyxFQUFFLENBQUM7d0JBQ2QsQ0FBQzt3QkFBQyxJQUFJLENBQUMsQ0FBQzs0QkFDSixNQUFNLEVBQUUsQ0FBQzt3QkFDYixDQUFDO29CQUNMLENBQUM7b0JBRUQsSUFBSSxF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LEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7NEJBQzFCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzs0QkFDakMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7NEJBQ3RDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDbEMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUM1QixLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQzVCLEdBQUcsQ0FBQyxDQUFDLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDO2dDQUM3QyxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7Z0NBQ3BCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0NBQ3JDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztnQ0FDOUIsQ0FBQzs0QkFDTCxDQUFDOzRCQUNELEdBQUcsQ0FBQyxDQUFDLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDO2dDQUM3QyxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7Z0NBQ3BCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0NBQ3JDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztnQ0FDOUIsQ0FBQzs0QkFDTCxDQUFDO3dCQUNMLENBQUM7d0JBQ0QsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7NEJBQ3pCLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQ0FDakMsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQ0FDMUIsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO29DQUNyQixLQUFLLENBQUMsTUFBTSxHQUFHO3dDQUNYLEdBQUcsRUFBRSxHQUFHO3dDQUNSLEtBQUssRUFBRSxHQUFHLENBQUMsS0FBSzt3Q0FDaEIsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFO3dDQUNWLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRTt3Q0FDVixJQUFJLEVBQUUsR0FBRyxDQUFDLElBQUk7cUNBQ2pCLENBQUE7b0NBQ0QsS0FBSyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO2dDQUVqQyxDQUFDOzRCQUNMLENBQUM7d0JBQ0wsQ0FBQztvQkFDTCxDQUFDO2dCQUdMLENBQUM7YUFDSixDQUFDO1FBQ04sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNaLENBQUMsQ0FBQyxDQUFDIn0=