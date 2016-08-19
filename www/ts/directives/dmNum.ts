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
                        } else {
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
                        }
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
                                })
                            }

                        })

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
                                    }
                                    scope.dmtype = iAttrs.dmtype;
                                    // iElm.attr(scope.params);
                                }
                            }
                        }
                    }


                }
            };
        }]);
});
