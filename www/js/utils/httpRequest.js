/**
 * 请求封装类
 * Created by luliang on 2015/11/19.
 */
//The response object has these properties:
//
//  data – {string|Object} – The response body transformed with the transform functions.
//  status – {number} – HTTP status code of the response.
//  headers – {function([headerName])} – Header getter function.
//config – {Object} – The configuration object that was used to generate the request.
//  statusText – {string} – HTTP status text of the response.
define(['app', 'js/utils/httpRequestBase', 'js/utils/md5'], function (app) {
    app
        .factory('httpRequest', ['$http', '$q', 'httpRequestBase', 'md5Utils', '$httpParamSerializerJQLike',
        function ($http, $q, httpRequestBase, md5Utils, $httpParamSerializerJQLike) {
            var getBaseUrl = function () {
                return APP.baseUrl;
            };
            /**
             *http请求
             * @param {Object} config
             * @param{function}[onSuccess]
             * @param{function}[onFailed]
             * @param{function}[onFinal]
             * @returns {object}promise
             */
            function requestMethod(config, onSuccess, onFailed, onFinal) {
                return httpRequestBase.request(config, function (response, data, status, headers, config, statusText) {
                    try {
                        var code = data.code;
                        //在这里处理公共错误
                        if (code == 303) {
                        }
                        if (code == 308) {
                            location.href = "#/login";
                        }
                        if (angular.isFunction(onSuccess)) {
                            onSuccess(response, data, status, headers, config, statusText);
                        }
                    }
                    catch (e) {
                        // ssjjLog.error("response Error："+e.name+"："+ e.message);
                        if (angular.isFunction(onFailed)) {
                            onFailed(response, data, status, headers, config, statusText);
                        }
                    }
                }, onFailed, onFinal);
            }
            return {
                /**
                 *Get请求
                 * @param {Object.<string|Object>} extraUrl 接口地址 不包括其他参数 例子?c=user&a=login 不要包括最后面的'&'
                 * @param {Object.<string|Object>}[extraParams] 请求参数 拼接到url后面
                 * @param {function}[onSuccess]
                 * @param {function}[onFailed]
                 * @param {function}[onFinal]
                 * @returns {object}promise
                 */
                get: function (extraUrl, extraParams, onSuccess, onFailed, onFinal) {
                    var httpConfig = {};
                    httpConfig.method = 'GET';
                    var url = getBaseUrl();
                    if (extraUrl.indexOf("http") >= 0) {
                        if (angular.isString(extraUrl)) {
                            url = extraUrl;
                            httpConfig.url = url;
                        }
                    }
                    else {
                        if (angular.isString(extraUrl)) {
                            url += extraUrl;
                            httpConfig.url = url;
                        }
                    }
                    // var params = MyUrl.getDefaultParams();
                    var params = {};
                    for (var key in extraParams) {
                        params[key] = extraParams[key];
                    }
                    if (angular.isString(params) || angular.isObject(params)) {
                        httpConfig.params = this.getPostParam(params);
                    }
                    delete data.sign;
                    delete data.time;
                    return requestMethod(httpConfig, onSuccess, onFailed, onFinal);
                },
                /**
                 * POST请求
                 * @param {string}extraUrl 接口地址 不包括其他参数 例子?c=user&a=login 不要包括最后面的'&'
                 * @param {string|Object}[data] post 表单提交的数据 post请求附带参数
                 * @param {function}[onSuccess]
                 * @param {function}[onFailed]
                 * @param {function}[onFinal]
                 * @returns {object}promise
                 */
                post: function (extraUrl, data, onSuccess, onFailed, onFinal) {
                    var httpConfig = {};
                    httpConfig.method = 'POST';
                    var url = getBaseUrl();
                    if (extraUrl.indexOf("http") >= 0) {
                        if (angular.isString(extraUrl)) {
                            url = extraUrl;
                            httpConfig.url = url;
                        }
                    }
                    else {
                        if (angular.isString(extraUrl)) {
                            url += extraUrl;
                            httpConfig.url = url;
                        }
                    }
                    // if(angular.isString(params) || angular.isObject(params)){
                    //   httpConfig.params = params;
                    // }
                    if (angular.isString(data) || angular.isObject(data)) {
                        httpConfig.data = $httpParamSerializerJQLike(this.getPostParam(data));
                    }
                    delete data.sign;
                    delete data.time;
                    return requestMethod(httpConfig, onSuccess, onFailed, onFinal);
                },
                getPostParam: function (postData) {
                    postData.time = +new Date();
                    postData.app_key = APP.app_key;
                    var arr = [];
                    for (var i in postData) {
                        arr.push(i + '=' + encodeURIComponent(postData[i]));
                    }
                    arr.sort();
                    var result = arr.join('&');
                    postData.sign = md5Utils.md5(result);
                    delete postData.app_key;
                    return postData;
                },
                getBaseUrl: getBaseUrl
            };
        }]);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cFJlcXVlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90cy91dGlscy9odHRwUmVxdWVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFDSCwyQ0FBMkM7QUFDM0MsRUFBRTtBQUNGLHdGQUF3RjtBQUN4Rix5REFBeUQ7QUFDekQsZ0VBQWdFO0FBQ2hFLHFGQUFxRjtBQUNyRiw2REFBNkQ7QUFDN0QsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFDLDBCQUEwQixFQUFDLGNBQWMsQ0FBQyxFQUFDLFVBQVMsR0FBRztJQUNuRSxHQUFHO1NBQ0EsT0FBTyxDQUFDLGFBQWEsRUFBQyxDQUFDLE9BQU8sRUFBQyxJQUFJLEVBQUMsaUJBQWlCLEVBQUMsVUFBVSxFQUFDLDRCQUE0QjtRQUM1RixVQUFTLEtBQUssRUFBQyxFQUFFLEVBQUMsZUFBZSxFQUFDLFFBQVEsRUFBQywwQkFBMEI7WUFFckUsSUFBSSxVQUFVLEdBQUc7Z0JBQ2YsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUM7WUFDckIsQ0FBQyxDQUFDO1lBQ0Y7Ozs7Ozs7ZUFPRztZQUNILHVCQUF1QixNQUFNLEVBQUMsU0FBUyxFQUFDLFFBQVEsRUFBQyxPQUFPO2dCQUN0RCxNQUFNLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUMsVUFBUyxRQUFRLEVBQUMsSUFBSSxFQUFDLE1BQU0sRUFBQyxPQUFPLEVBQUMsTUFBTSxFQUFDLFVBQVU7b0JBQzNGLElBQUksQ0FBQzt3QkFDSCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO3dCQUNyQixXQUFXO3dCQUNYLEVBQUUsQ0FBQSxDQUFDLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUVqQixDQUFDO3dCQUNELEVBQUUsQ0FBQSxDQUFDLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDOzRCQUNmLFFBQVEsQ0FBQyxJQUFJLEdBQUMsU0FBUyxDQUFDO3dC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