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
      }
      if (window.dmwechat) {
        window.dmwechat.init(params, (a, b, c, d) => {
          // Tips.showTips('分享初始化成功');
        }, (a, b, c, d) => {
          Tips.showTips('分享初始化失敗');
        })
      }
      if (window.DMPush) {
        // 初始化友盟推送
        window.DMPush.init('友盟初始化。。。', () => {
          // Tips.showTips('友盟初始化成功');
        }, () => {
          // Tips.showTips('友盟初始化失败');
        })
      }

    } catch (e) {
      console.error(e.stack || e.message || e);
    }
  });

});