/**
 * Created by luliang on 2015/11/13.
 */
define(function (require, exports, module) {
    var Common = {
        hasLogin: function () {
            var uid = localStorage.getItem('uid');
            if (uid) {
                return true;
            }
            else {
                return false;
            }
        }
    };
    module.exports = Common;
});
//var params="sessid="+sessid+"&"+"appid="+appid+"&"+"v="+v+"&"+
//  "ct="+ct+"&"+"did="+did+"&"+"os="+os+"&"+"nm="+nm+"&"+"mno="+mno+"&"
//  +"dm="+dm+"&"+"time="+time+"&"+"sign="+sign;//11个参数
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdHMvdXRpbHMvY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztHQUVHO0FBRUgsTUFBTSxDQUFDLFVBQVUsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNO0lBQ3ZDLElBQUksTUFBTSxHQUFHO1FBQ1gsUUFBUSxFQUFFO1lBQ1IsSUFBSSxHQUFHLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN0QyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNSLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDZCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sTUFBTSxDQUFDLEtBQUssQ0FBQztZQUNmLENBQUM7UUFDSCxDQUFDO0tBQ0YsQ0FBQTtJQUNELE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0FBQzFCLENBQUMsQ0FBQyxDQUFDO0FBQ0gsZ0VBQWdFO0FBQ2hFLHdFQUF3RTtBQUN4RSx1REFBdUQifQ==