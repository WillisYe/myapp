define(['ionic', 'app', 'routes', 'appConfig', 'js/utils/tips'], function (ionic, app, routes, appConfig, Tips) {
    'use strict';
    var $html;
    $html = angular.element(document.getElementsByTagName('html')[0]);
    $html.ready(function () {
        try {
            angular.bootstrap(document, ['app']);
            // 初始化分享
            // 初始化APPID KEY
            var params = {
                sinaKey: "1399888483",
                sinaSecret: "441ed24920f1800de4f0703848070f2d",
                wechatKey: "wxffbb158f276a034b",
                wechatSecret: "819d8da9aeb82103113f1e867c736593",
                tecentKey: "1105526408",
                tecentSecret: "jQqcjOU7QKhomCGS"
            };
            if (window.dmwechat) {
                window.dmwechat.init(params, function (a, b, c, d) {
                    // Tips.showTips('分享初始化成功');
                }, function (a, b, c, d) {
                    Tips.showTips('分享初始化失敗');
                });
            }
            if (window.DMPush) {
                // 初始化友盟推送
                window.DMPush.init('友盟初始化。。。', function () {
                    // Tips.showTips('友盟初始化成功');
                }, function () {
                    // Tips.showTips('友盟初始化失败');
                });
            }
        }
        catch (e) {
            console.error(e.stack || e.message || e);
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9vdHN0cmFwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vdHMvYm9vdHN0cmFwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sQ0FBQyxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxlQUFlLENBQUMsRUFBRSxVQUFVLEtBQUssRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxJQUFJO0lBQzVHLFlBQVksQ0FBQztJQUNiLElBQUksS0FBSyxDQUFDO0lBQ1YsS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEUsS0FBSyxDQUFDLEtBQUssQ0FBQztRQUNWLElBQUksQ0FBQztZQUNILE9BQU8sQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNyQyxRQUFRO1lBQ1IsZUFBZTtZQUNmLElBQUksTUFBTSxHQUFHO2dCQUNYLE9BQU8sRUFBRSxZQUFZO2dCQUNyQixVQUFVLEVBQUUsa0NBQWtDO2dCQUM5QyxTQUFTLEVBQUUsb0JBQW9CO2dCQUMvQixZQUFZLEVBQUUsa0NBQWtDO2dCQUNoRCxTQUFTLEVBQUUsWUFBWTtnQkFDdkIsWUFBWSxFQUFFLGtCQUFrQjthQUNqQyxDQUFBO1lBQ0QsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxVQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7b0JBQ3RDLDRCQUE0QjtnQkFDOUIsQ0FBQyxFQUFFLFVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztvQkFDWixJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUMzQixDQUFDLENBQUMsQ0FBQTtZQUNKLENBQUM7WUFDRCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDbEIsVUFBVTtnQkFDVixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7b0JBQzdCLDRCQUE0QjtnQkFDOUIsQ0FBQyxFQUFFO29CQUNELDRCQUE0QjtnQkFDOUIsQ0FBQyxDQUFDLENBQUE7WUFDSixDQUFDO1FBRUgsQ0FBRTtRQUFBLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDWCxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQztRQUMzQyxDQUFDO0lBQ0gsQ0FBQyxDQUFDLENBQUM7QUFFTCxDQUFDLENBQUMsQ0FBQyJ9