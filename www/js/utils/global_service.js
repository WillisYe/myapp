/**
 * 全局变量 全局方法
 * Created by luliang on 2015/12/12.
 */
define([
    'app',
    'html/trolley/trolley_service'
], function (app) {
    'use strict';
    app
        .factory('Global', ['$rootScope', 'trolleyInfo', function ($rootScope, trolleyInfo) {
            $rootScope.bell_news = 0; //系统消息+通知消息-红包消息
            $rootScope.notify_news = 0; //所有通知消息
            $rootScope.notify_invite_new = 0; //通知-邀请消息
            $rootScope.notify_lucky_new = 0; //通知-中奖消息
            $rootScope.sys_new = 0; //系统消息未读数
            $rootScope.notify_hongbao_new = 0; //新红包数
            $rootScope.all_new = 0; //所有消息
            function setNoticeNew(msg) {
                if (!angular.isObject(msg)) {
                    return;
                }
                $rootScope.sys_new = msg.sys_new ? msg.sys_new : 0;
                $rootScope.notify_hongbao_new = msg.notify_hongbao_new ? msg.notify_hongbao_new : 0;
                $rootScope.notify_invite_new = msg.notify_invite_new ? msg.notify_invite_new : 0;
                $rootScope.notify_lucky_new = msg.notify_lucky_new ? msg.notify_lucky_new : 0;
                $rootScope.all_new = $rootScope.sys_new + $rootScope.notify_hongbao_new + $rootScope.notify_invite_new + $rootScope.notify_lucky_new + $rootScope.sys_new;
                $rootScope.bell_news = $rootScope.all_new - $rootScope.notify_hongbao_new;
                $rootScope.notify_news = $rootScope.bell_news - $rootScope.sys_new;
            }
            //
            function clearNoticeNew(type) {
                if (type == 0) {
                    $rootScope.all_new = 0;
                }
                else if (type == 1) {
                    $rootScope.sys_new = 0;
                }
                else if (type == 2) {
                    $rootScope.notify_hongbao_new = 0;
                }
            }
            $rootScope.trolleySum = function () {
                return trolleyInfo.getGoodsInfo().length;
            };
            var browser = {
                versions: function () {
                    var u = navigator.userAgent, app = navigator.appVersion;
                    return {
                        trident: u.indexOf('Trident') > -1,
                        presto: u.indexOf('Presto') > -1,
                        webKit: u.indexOf('AppleWebKit') > -1,
                        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,
                        //mobile: !!u.match(/AppleWebKit.*Mobile.*/)||!!u.match(/AppleWebKit/), //是否为移动终端
                        mobile: u.indexOf('Android') > -1 || u.indexOf('iPhone') > -1 || u.indexOf('iPad') > -1,
                        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
                        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
                        iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1,
                        iPad: u.indexOf('iPad') > -1,
                        webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
                    };
                }()
            };
            var inviteCode;
            function isInweixinBrowser() {
                var ua = navigator.userAgent.toLowerCase();
                return ua.match(/MicroMessenger/i) == "micromessenger";
            }
            function isInAPP() {
                return navigator.camera;
            }
            function getInviteCode() {
                return inviteCode;
            }
            function setInviteCode(invidecode) {
                inviteCode = invidecode;
            }
            return {
                isInAPP: isInAPP,
                isInweixinBrowser: isInweixinBrowser,
                setInviteCode: setInviteCode,
                getInviteCode: getInviteCode,
                setNoticeNew: setNoticeNew,
                clearNoticeNew: clearNoticeNew
            };
        }
    ]);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xvYmFsX3NlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90cy91dGlscy9nbG9iYWxfc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFDSCxNQUFNLENBQUM7SUFDTCxLQUFLO0lBQ0wsOEJBQThCO0NBQy9CLEVBQUMsVUFBUyxHQUFHO0lBQ1osWUFBWSxDQUFDO0lBQ2IsR0FBRztTQUNBLE9BQU8sQ0FBQyxRQUFRLEVBQUMsQ0FBQyxZQUFZLEVBQUMsYUFBYSxFQUFDLFVBQVMsVUFBVSxFQUFDLFdBQVc7WUFDM0UsVUFBVSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQSxnQkFBZ0I7WUFDekMsVUFBVSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQSxRQUFRO1lBQ25DLFVBQVUsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUMsQ0FBQSxTQUFTO1lBQzFDLFVBQVUsQ0FBQyxnQkFBZ0IsR0FBRyxDQUFDLENBQUMsQ0FBQSxTQUFTO1lBQ3pDLFVBQVUsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUEsU0FBUztZQUNoQyxVQUFVLENBQUMsa0JBQWtCLEdBQUcsQ0FBQyxDQUFDLENBQUEsTUFBTTtZQUN4QyxVQUFVLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFBLE1BQU07WUFDN0Isc0JBQXNCLEdBQUc7Z0JBQ3ZCLEVBQUUsQ0FBQSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBLENBQUM7b0JBQ3pCLE1BQU0sQ0FBRTtnQkFDVixDQUFDO2dCQUNELFVBQVUsQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztnQkFDbkQsVUFBVSxDQUFDLGtCQUFrQixHQUFHLEdBQUcsQ0FBQyxrQkFBa0IsR0FBRyxHQUFHLENBQUMsa0JBQWtCLEdBQUcsQ0FBQyxDQUFDO2dC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