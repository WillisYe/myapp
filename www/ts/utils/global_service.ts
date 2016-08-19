/**
 * 全局变量 全局方法
 * Created by luliang on 2015/12/12.
 */
define([
  'app',
  'html/trolley/trolley_service'
],function(app){
  'use strict';
  app
    .factory('Global',['$rootScope','trolleyInfo',function($rootScope,trolleyInfo){
      $rootScope.bell_news = 0;//系统消息+通知消息-红包消息
      $rootScope.notify_news = 0;//所有通知消息
      $rootScope.notify_invite_new = 0;//通知-邀请消息
      $rootScope.notify_lucky_new = 0;//通知-中奖消息
      $rootScope.sys_new = 0;//系统消息未读数
      $rootScope.notify_hongbao_new = 0;//新红包数
      $rootScope.all_new = 0;//所有消息
      function setNoticeNew(msg){
        if(!angular.isObject(msg)){
          return ;
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
      function clearNoticeNew(type){
        if(type == 0){
          $rootScope.all_new = 0;
        }else if(type == 1){
          $rootScope.sys_new = 0;
        }else if(type == 2){
          $rootScope.notify_hongbao_new = 0;
        }
      }

      $rootScope.trolleySum = function(){
        return trolleyInfo.getGoodsInfo().length;
      };

      var browser={
        versions:function(){
          var u = navigator.userAgent, app = navigator.appVersion;
          return {
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            //mobile: !!u.match(/AppleWebKit.*Mobile.*/)||!!u.match(/AppleWebKit/), //是否为移动终端
            mobile: u.indexOf('Android') > -1 || u.indexOf('iPhone') > -1 || u.indexOf('iPad') > -1, //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
            iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
          };
        }()
      };

      var inviteCode;

      function isInweixinBrowser(){
        var ua = navigator.userAgent.toLowerCase();
        return ua.match(/MicroMessenger/i) == "micromessenger";
      }
      function isInAPP(){
        return navigator.camera;
      }

      function getInviteCode(){
        return inviteCode;
      }

      function setInviteCode(invidecode){
        inviteCode = invidecode;
      }
      return{
        isInAPP : isInAPP,
        isInweixinBrowser : isInweixinBrowser,
        setInviteCode : setInviteCode,
        getInviteCode : getInviteCode,
        setNoticeNew : setNoticeNew,
        clearNoticeNew : clearNoticeNew
      }
    }
    ]);
});

