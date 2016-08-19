define(['app', 'js/utils/tips', 'lib/jquery/jquery1.9.1.min', 'lib/toastr/toastr.min'], function (app, Tips, $, toastr) {
    app.controller('es6Ctrl', ['$scope', '$ionicHistory', 'httpRequest', '$ionicSlideBoxDelegate', '$sce', '$cordovaInAppBrowser', es6Ctrl]);
    function es6Ctrl($scope, $ionicHistory, httpRequest, $ionicSlideBoxDelegate, $sce, $cordovaInAppBrowser) {
        var vm = this;
        var _a = [1, 2, 3], a = _a[0], _b = _a[1], b = _b === void 0 ? a + 1 : _b, _c = _a[2], c = _c === void 0 ? a + 2 : _c;
        console.log(a, b, c);
        var _d = { foo: "aaa", bar: "bbb" }, bar = _d.bar, foo = _d.foo;
        console.log(foo, bar);
        var baz = { jg: "aaa", bar: "bbb" }.jg;
        console.log(baz);
        var _e = 'hello', a = _e[0], b = _e[1], c = _e[2], d = _e[3], e = _e[4];
        console.log(a, b, c, d, e);
        var len = 'hello'.length;
        console.log(len);
        var s = 'Hello world!';
        console.log(s.startsWith('Hello'), s.endsWith('!'), s.includes('o'));
        console.log('x'.repeat(3));
        var name = "Bob", time = "today";
        var str = "Hello " + name + ", how are you " + time + "?";
        console.log(str);
        function test(name, age) {
            if (name === void 0) { name = 'yezi'; }
            if (age === void 0) { age = 18; }
            console.log(name + " is " + age);
        }
        test();
        (function (s) {
            var arr_a = [1, 2, 3];
            var arr_b = [4, 5, 6];
            var arr_c = arr_a.concat(arr_b);
            console.log(arr_c);
            var r = '';
            switch (true) {
                case (s >= 0 && s < 60):
                    r = '不及格';
                    break;
                case (s >= 60 && s < 80):
                    r = '及格';
                    break;
                case (s >= 80 && s < 90):
                    r = '良好';
                    break;
                case (s >= 90 && s < 100):
                    r = '优秀';
                    break;
                case (s == 100):
                    r = '满分';
                    break;
                default:
                    r = "请重新输入成绩";
                    break;
            }
            console.log(r);
        })(100);
        $scope.goBack = function () {
            $ionicHistory.goBack();
        };
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXM2LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vdHMvY29udHJvbGxlcnMvaHRtbC9lczYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFLGVBQWUsRUFBRSw0QkFBNEIsRUFBRSx1QkFBdUIsQ0FBQyxFQUFFLFVBQVUsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsTUFBTTtJQUNsSCxHQUFHLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxDQUFDLFFBQVEsRUFBRSxlQUFlLEVBQUUsYUFBYSxFQUFFLHdCQUF3QixFQUFFLE1BQU0sRUFBRSxzQkFBc0IsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ3pJLGlCQUFpQixNQUFNLEVBQUUsYUFBYSxFQUFFLFdBQVcsRUFBRSxzQkFBc0IsRUFBRSxJQUFJLEVBQUUsb0JBQW9CO1FBQ25HLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQztRQUNkLElBQUEsY0FBeUMsRUFBcEMsU0FBQyxFQUFFLFVBQVMsRUFBVCw4QkFBUyxFQUFFLFVBQVMsRUFBVCw4QkFBUyxDQUFjO1FBQzFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUVyQixJQUFBLCtCQUE2QyxFQUF2QyxZQUFHLEVBQUUsWUFBRyxDQUFnQztRQUM5QyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUVoQixzQ0FBTyxDQUErQjtRQUM1QyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRWpCLElBQUEsWUFBNkIsRUFBeEIsU0FBQyxFQUFFLFNBQUMsRUFBRSxTQUFDLEVBQUUsU0FBQyxFQUFFLFNBQUMsQ0FBWTtRQUM5QixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztR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