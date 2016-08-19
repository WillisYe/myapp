/**
 * 请求基类
 * Created by luliang on 2016/2/1.
 */
define(['app'],function(app){
  app
    .factory('httpRequestBase',['$http','$q',function($http,$q){

      // var _onSuccess;
      // var _onFailed;
      // var _onFinal;

      function noop(){

      }


      // function getCallback(onSuccess,onFailed,onFinal){
      //   _onSuccess = angular.isFunction(onSuccess) ? onSuccess : noop;
      //   _onFailed = angular.isFunction(onFailed) ? onFailed : noop;
      //   _onFinal = angular.isFunction(onFinal) ? onFinal : noop;
      // }

      // function resetCallBack(){
      //   _onSuccess = noop;
      //   _onFailed = noop;
      //   _onFinal = noop;
      // }

      /**
       *http请求
       * @param {Object} config
       * @param{function}[onSuccess]
       * @param{function}[onFailed]
       * @param{function}[onFinal]
       * @returns {object}promise
       */
      function requestMethod(config,onSuccess,onFailed,onFinal){
        // getCallback(onSuccess,onFailed,onFinal);
        var _onSuccess = angular.isFunction(onSuccess) ? onSuccess : noop;
        var _onFailed = angular.isFunction(onFailed) ? onFailed : noop;
        var _onFinal = angular.isFunction(onFinal) ? onFinal : noop;
        
        var deferredAbort = $q.defer();
        config.timeout = deferredAbort.promise;
        config.headers = {'Content-Type':'application/x-www-form-urlencoded;charset=utf-8'};
        var request = $http(config);
        var requestPromise = request.then(
          function(response){
            if (response.status == 200) {
              _onSuccess(response,response.data,response.status,response.headers,response.config,response.statusText);
            } else {
              _onFailed(response,response.data,response.status,response.headers,response.config,response.statusText);
            }
          },
          function(response){
            _onFailed(response,response.data,response.status,response.headers,response.config,response.statusText);
          }
        );
        requestPromise.cancelRequest = function(){
          deferredAbort.resolve();
          _onFinal('取消');
        };
        requestPromise.finally(function(){
          requestPromise.cancel = angular.noop;
          deferredAbort = request = requestPromise = null;
          _onFinal('结束');
        });
        return requestPromise;
      }

      return{
        request : requestMethod
      };
    }]);
});
