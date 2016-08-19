/*
    弹框提示
    example：showTips('请输入密码', 3000);
*/
define(function (require, exports, module) {
    function showTips(msg, timeout) {
        var body = document.getElementsByTagName('body');
        var div = document.createElement('div');
        div.className = "dm-tips";
        div.innerHTML = msg;
        body[0].appendChild(div);
        var t = timeout || 2000;
        div.style.animation = 'tipsHide ' + t / 1000 + 's cubic-bezier(0.42, 0, 0.9, 0.21) forwards';
        setTimeout(function () {
            body[0].removeChild(div);
        }, t);
    }
    module.exports = {
        'showTips': showTips
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlwcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3RzL3V0aWxzL3RpcHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztFQUdFO0FBQ0YsTUFBTSxDQUFDLFVBQVUsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNO0lBRXhDLGtCQUFrQixHQUFHLEVBQUUsT0FBTztRQUM3QixJQUFJLElBQUksR0FBRyxRQUFRLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDakQsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4QyxHQUFHLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMxQixHQUFHLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQztRQUNwQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxHQUFHLE9BQU8sSUFBSSxJQUFJLENBQUM7UUFDeEIsR0FBRyxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsV0FBVyxHQUFHLENBQUMsR0FBQyxJQUFJLEdBQUcsNkNBQTZDLENBQUM7UUFDM0YsVUFBVSxDQUFDO1lBQ1YsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMxQixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUEsTUFBTSxDQUFDLE9BQU8sR0FBRztRQUNoQixVQUFVLEVBQUUsUUFBUTtLQUNwQixDQUFBO0FBQ0gsQ0FBQyxDQUFDLENBQUMifQ==