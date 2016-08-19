
define(['app', 'js/utils/tips', 'lib/jquery/jquery1.9.1.min', 'lib/toastr/toastr.min'], function (app, Tips, $, toastr) {
    app.controller('es6Ctrl', ['$scope', '$ionicHistory', 'httpRequest', '$ionicSlideBoxDelegate', '$sce', '$cordovaInAppBrowser', es6Ctrl]);
    function es6Ctrl($scope, $ionicHistory, httpRequest, $ionicSlideBoxDelegate, $sce, $cordovaInAppBrowser) {
        var vm = this;
        var [a, b = a + 1, c = a + 2] = [1, 2, 3];
        console.log(a, b, c);

        var { bar, foo } = { foo: "aaa", bar: "bbb" };
        console.log(foo, bar);

        var { jg: baz } = { jg: "aaa", bar: "bbb" };
        console.log(baz);

        var [a, b, c, d, e] = 'hello';
        console.log(a, b, c, d, e);

        let {length: len} = 'hello';
        console.log(len);

        var s = 'Hello world!';
        console.log(s.startsWith('Hello'), s.endsWith('!'), s.includes('o'));

        console.log('x'.repeat(3));

        var name = "Bob", time = "today";
        var str = `Hello ${name}, how are you ${time}?`
        console.log(str);

        function test(name='yezi', age=18){
            console.log(`${name} is ${age}`)
        }
        test();

        (s => {
            let arr_a = [1,2,3];
            let arr_b = [4,5,6];
            let arr_c = [...arr_a, ...arr_b]
            console.log(arr_c);
            var r = '';
            switch (true) {
                case (s>=0 && s<60):
                    r = '不及格';
                    break;
                case (s>=60 && s<80):
                    r = '及格';
                    break;
                case (s>=80 && s<90):
                    r = '良好';
                    break;
                case (s>=90 && s<100):
                    r = '优秀';
                    break;
                case (s==100):
                    r = '满分';
                    break;            
                default:
                    r="请重新输入成绩"
                    break;
            }
            console.log(r);
        })(100);     

        $scope.goBack = () => {
            $ionicHistory.goBack()
        }
    }

});

