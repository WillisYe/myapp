/**
 * Created by luliang on 2015/11/13.
 */

define(function (require, exports, module) {
  var Common = {
    hasLogin: function () {
      var uid = localStorage.getItem('uid');
      if (uid) {
        return true;
      } else {
        return false;
      }
    }
  }
  module.exports = Common;
});
//var params="sessid="+sessid+"&"+"appid="+appid+"&"+"v="+v+"&"+
//  "ct="+ct+"&"+"did="+did+"&"+"os="+os+"&"+"nm="+nm+"&"+"mno="+mno+"&"
//  +"dm="+dm+"&"+"time="+time+"&"+"sign="+sign;//11个参数
