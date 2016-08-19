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
define(['app','js/utils/httpRequestBase','js/utils/md5'],function(app){
  app
    .factory('httpRequest',['$http','$q','httpRequestBase','md5Utils','$httpParamSerializerJQLike',
      function($http,$q,httpRequestBase,md5Utils,$httpParamSerializerJQLike){
      
      var getBaseUrl = function(){
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
      function requestMethod(config,onSuccess,onFailed,onFinal){
        return httpRequestBase.request(config,function(response,data,status,headers,config,statusText){
          try {
            var code = data.code;
            //在这里处理公共错误
            if(code == 303) {              
              // location.href="#/login";                 
            }
            if(code == 308) {
              location.href="#/login";
            }
            if (angular.isFunction(onSuccess)) {
              onSuccess(response,data,status,headers,config,statusText);
            }
            
          } catch (e) {
            // ssjjLog.error("response Error："+e.name+"："+ e.message);
            if(angular.isFunction(onFailed)){
              onFailed(response,data,status,headers,config,statusText);
            }
          }
        },onFailed,onFinal);
      }


      return{
        /**
         *Get请求
         * @param {Object.<string|Object>} extraUrl 接口地址 不包括其他参数 例子?c=user&a=login 不要包括最后面的'&'
         * @param {Object.<string|Object>}[extraParams] 请求参数 拼接到url后面
         * @param {function}[onSuccess]
         * @param {function}[onFailed]
         * @param {function}[onFinal]
         * @returns {object}promise
         */
        get: function(extraUrl,extraParams,onSuccess,onFailed,onFinal){

          var httpConfig = {};
          httpConfig.method = 'GET';
          var url = getBaseUrl();
          if(extraUrl.indexOf("http")>=0){
            if(angular.isString(extraUrl)){
              url=extraUrl;
              httpConfig.url = url;
            }
          }else{
            if(angular.isString(extraUrl)){
              url+=extraUrl;
              httpConfig.url = url;
            }
          }
          // var params = MyUrl.getDefaultParams();
          var params = {};
          for(var key in extraParams){
            params[key] = extraParams[key];
          }
          if(angular.isString(params) || angular.isObject(params)){
            httpConfig.params = this.getPostParam(params);
          }
          delete data.sign;
          delete data.time;
          return requestMethod(httpConfig,onSuccess,onFailed,onFinal);
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
        post: function(extraUrl,data,onSuccess,onFailed,onFinal){
          var httpConfig = {};
          httpConfig.method = 'POST';
          var url = getBaseUrl();
          if(extraUrl.indexOf("http")>=0){
            if(angular.isString(extraUrl)){
              url=extraUrl;
              httpConfig.url = url;
            }
          }else{
            if(angular.isString(extraUrl)){
              url+=extraUrl;
              httpConfig.url = url;
            }
          }

          // if(angular.isString(params) || angular.isObject(params)){
          //   httpConfig.params = params;
          // }
          if(angular.isString(data) || angular.isObject(data)){
            httpConfig.data = $httpParamSerializerJQLike(this.getPostParam(data));
          }
          delete data.sign;
          delete data.time;
          return requestMethod(httpConfig,onSuccess,onFailed,onFinal);
        },
        getPostParam: function(postData) {
            postData.time = +new Date(); 
            postData.app_key = APP.app_key;
            var arr = [];
            for(var i in postData) {
                arr.push(i + '=' + encodeURIComponent(postData[i]));
            }
            arr.sort();
            var result = arr.join('&');  
            postData.sign = md5Utils.md5(result);
            delete postData.app_key;
            return postData;
        },
        getBaseUrl:getBaseUrl
      };
    }]);
});
