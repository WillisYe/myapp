/**
 * Created by luliang on 2015/11/13.
 */
define([
    'app',
    'utils/md5',
    './storage',
    './local_database'], function (app) {
    app
        .factory('MyUrl', ['md5Utils', 'Storage', 'localDatabase', function (md5Utils, Storage, localDatabase) {
            // Might use a resource here that returns a JSON array
            var sessid = encodeURIComponent("");
            var appid = 10003;
            var appkey = "DDV02-N710UJ-2MR2G-K2DXK-9103C";
            var v = "1.0.1";
            var did = "";
            var os = "";
            var nm = "";
            var mno = "";
            var dm = "";
            //var time = new Date().getTime();
            var time = '';
            var sign;
            //var params = {
            //        sessid:getSessid(),appid:appid,v:v,ct:ct,did:did,os:os,nm:nm,mno:mno,dm:dm,
            //      time:time,sign:getSign()
            //  };
            /**
             * 设置设备信息，并存储到本地
             * @param mDid
             * @param mOs
             * @param mNm
             * @param mMno
             * @param mDm
             */
            var setDeviceInfo = function (mDid, mOs, mNm, mMno, mDm) {
                did = mDid;
                os = mOs;
                nm = mNm;
                mno = mMno;
                dm = mDm;
                //设备信息存储到本地
                localDatabase.setDid(did);
                localDatabase.setOs(os);
                localDatabase.setNm(nm);
                localDatabase.setMno(mno);
                localDatabase.setDm(dm);
            };
            /**
             * 从本地存储中获取设备信息
             */
            var getDeviceInfoFromLocalStorage = function () {
                did = localDatabase.getDid();
                os = localDatabase.getOs();
                nm = localDatabase.getNm();
                mno = localDatabase.getMno();
                dm = localDatabase.getDm();
            };
            function getSessid() {
                if (!isStringNotEmpty(sessid)) {
                    var _sessId = Storage.get("sessId");
                    if (_sessId) {
                        sessid = _sessId;
                    }
                }
                return sessid;
            }
            function getTimeStamp() {
                time = new Date().getTime();
                return time;
            }
            function getFormMd5(formId, time, formData) {
                return md5Utils.md5(appkey + formId + time + formData);
            }
            function isLogin() {
                return isStringNotEmpty(getSessid());
            }
            function getSign() {
                sign = md5Utils.md5(appkey + time + getSessid());
                return sign;
            }
            function setSessid(value) {
                var encodeId = encodeURIComponent(value);
                var sessIdString = getSessid();
                if (isStringNotEmpty(value) && (encodeId != sessIdString)) {
                    sessid = encodeId;
                    Storage.set("sessId", sessid);
                }
            }
            function clear() {
                sessid = '';
                Storage.set("sessId", sessid);
            }
            var getDefaultParams = function () {
                getDeviceInfoFromLocalStorage();
                getTimeStamp();
                return {
                    sessid: getSessid(),
                    appid: appid,
                    v: v,
                    ct: getCt(),
                    did: did,
                    os: os,
                    nm: nm,
                    mno: mno,
                    dm: dm,
                    time: time,
                    sign: getSign()
                };
            };
            function getCt() {
                var ct = 1;
                if (navigator.userAgent.indexOf('Android') > -1) {
                    ct = 2;
                }
                else if (navigator.userAgent.indexOf('iPhone') > -1) {
                    ct = 4;
                }
                else if (navigator.userAgent.indexOf('iPad') > -1) {
                    ct = 5;
                }
                return ct;
            }
            function isStringNotEmpty(string) {
                return angular.isString(string) && (string.replace(/(^s*)|(s*$)/g, "").length > 0);
            }
            return {
                setDeviceInfo: setDeviceInfo,
                isStringNotEmpty: isStringNotEmpty,
                getDefaultParams: getDefaultParams,
                setSessid: setSessid,
                getSessid: getSessid,
                getTimeStamp: getTimeStamp,
                getFormMd5: getFormMd5,
                isLogin: isLogin,
                clear: clear
            };
        }]);
});
//var params="sessid="+sessid+"&"+"appid="+appid+"&"+"v="+v+"&"+
//  "ct="+ct+"&"+"did="+did+"&"+"os="+os+"&"+"nm="+nm+"&"+"mno="+mno+"&"
//  +"dm="+dm+"&"+"time="+time+"&"+"sign="+sign;//11个参数
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0dXJsX3NlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90cy91dGlscy9nZXR1cmxfc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7R0FFRztBQUVILE1BQU0sQ0FBQztJQUNILEtBQUs7SUFDTCxXQUFXO0lBQ1gsV0FBVztJQUNYLGtCQUFrQixDQUFDLEVBQ3JCLFVBQVMsR0FBRztJQUNaLEdBQUc7U0FDQSxPQUFPLENBQUMsT0FBTyxFQUFDLENBQUMsVUFBVSxFQUFDLFNBQVMsRUFBQyxlQUFlLEVBQUMsVUFBVSxRQUFRLEVBQUMsT0FBTyxFQUFDLGFBQWE7WUFDN0Ysc0RBQXNEO1lBRXRELElBQUksTUFBTSxHQUFHLGtCQUFrQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3BDLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQztZQUNsQixJQUFJLE1BQU0sR0FBRyxnQ0FBZ0MsQ0FBQztZQUM5QyxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUM7WUFDaEIsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO1lBQ2IsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDO1lBQ1osSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFFO1lBQ2IsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO1lBQ2IsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDO1lBRVosa0NBQWtDO1lBQ2xDLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBRTtZQUNmLElBQUksSUFBSSxDQUFDO1lBQ1QsZ0JBQWdCO1lBQ2hCLHFGQUFxRjtZQUNyRixnQ0FBZ0M7WUFDaEMsTUFBTTtZQUVOOzs7Ozs7O2VBT0c7WUFDSCxJQUFJLGFBQWEsR0FBRyxVQUFTLElBQUksRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLElBQUksRUFBQyxHQUFHO2dCQUNoRCxHQUFHLEdBQUcsSUFBSSxDQUFFO2dCQUNaLEVBQUUsR0FBRyxHQUFHLENBQUU7Z0JBQ1YsRUFBRSxHQUFHLEdBQUcsQ0FBRTtn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