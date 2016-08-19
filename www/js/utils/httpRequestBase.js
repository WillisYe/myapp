/**
 * 请求基类
 * Created by luliang on 2016/2/1.
 */
define(['app'], function (app) {
    app
        .factory('httpRequestBase', ['$http', '$q', function ($http, $q) {
            // var _onSuccess;
            // var _onFailed;
            // var _onFinal;
            function noop() {
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
            function requestMethod(config, onSuccess, onFailed, onFinal) {
                // getCallback(onSuccess,onFailed,onFinal);
                var _onSuccess = angular.isFunction(onSuccess) ? onSuccess : noop;
                var _onFailed = angular.isFunction(onFailed) ? onFailed : noop;
                var _onFinal = angular.isFunction(onFinal) ? onFinal : noop;
                var deferredAbort = $q.defer();
                config.timeout = deferredAbort.promise;
                config.headers = { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' };
                var request = $http(config);
                var requestPromise = request.then(function (response) {
                    if (response.status == 200) {
                        _onSuccess(response, response.data, response.status, response.headers, response.config, response.statusText);
                    }
                    else {
                        _onFailed(response, response.data, response.status, response.headers, response.config, response.statusText);
                    }
                }, function (response) {
                    _onFailed(response, response.data, response.status, response.headers, response.config, response.statusText);
                });
                requestPromise.cancelRequest = function () {
                    deferredAbort.resolve();
                    _onFinal('取消');
                };
                requestPromise.finally(function () {
                    requestPromise.cancel = angular.noop;
                    deferredAbort = request = requestPromise = null;
                    _onFinal('结束');
                });
                return requestPromise;
            }
            return {
                request: requestMethod
            };
        }]);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cFJlcXVlc3RCYXNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdHMvdXRpbHMvaHR0cFJlcXVlc3RCYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7R0FHRztBQUNILE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFDLFVBQVMsR0FBRztJQUN6QixHQUFHO1NBQ0EsT0FBTyxDQUFDLGlCQUFpQixFQUFDLENBQUMsT0FBTyxFQUFDLElBQUksRUFBQyxVQUFTLEtBQUssRUFBQyxFQUFFO1lBRXhELGtCQUFrQjtZQUNsQixpQkFBaUI7WUFDakIsZ0JBQWdCO1lBRWhCO1lBRUEsQ0FBQztZQUdELG9EQUFvRDtZQUNwRCxtRUFBbUU7WUFDbkUsZ0VBQWdFO1lBQ2hFLDZEQUE2RDtZQUM3RCxJQUFJO1lBRUosNEJBQTRCO1lBQzVCLHVCQUF1QjtZQUN2QixzQkFBc0I7WUFDdEIscUJBQXFCO1lBQ3JCLElBQUk7WUFFSjs7Ozs7OztlQU9HO1lBQ0gsdUJBQXVCLE1BQU0sRUFBQyxTQUFTLEVBQUMsUUFBUSxFQUFDLE9BQU87Z0JBQ3RELDJDQUEyQztnQkFDM0MsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxTQUFTLEdBQUcsSUFBSSxDQUFDO2dCQUNsRSxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxHQUFHLFFBQVEsR0FBRyxJQUFJLENBQUM7Z0JBQy9ELElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQztnQkFFNUQsSUFBSSxhQUFhLEdBQUcsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUMvQixNQUFNLENBQUMsT0FBTyxHQUFHLGFBQWEsQ0FBQyxPQUFPLENBQUM7Z0JBQ3ZDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsRUFBQyxjQUFjLEVBQUMsaURBQWlELEVBQUMsQ0FBQztnQkFDcEYsSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUM1QixJQUFJLGNBQWMsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUMvQixVQUFTLFFBQVE7b0JBQ2YsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUMzQixVQUFVLENBQUMsUUFBUSxFQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUMsUUFBUSxDQUFDLE1BQU0sRUFBQyxRQUFRLENBQUMsT0FBTyxFQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUMxRyxDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNOLFNBQVMsQ0FBQyxRQUFRLEVBQUMsUUFBUSxDQUFDLElBQUksRUFBQyxRQUFRLENBQUMsTUFBTSxFQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUMsUUFBUSxDQUFDLE1BQU0sRUFBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7b0JBQ3pHLENBQUM7Z0JBQ0gsQ0FBQyxFQUNELFVBQVMsUUFBUTtvQkFDZixTQUFTLENBQUMsUUFBUSxFQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUMsUUFBUSxDQUFDLE1BQU0sRUFBQyxRQUFRLENBQUMsT0FBTyxFQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUN6RyxDQUFDLENBQ0YsQ0FBQztnQkFDRixjQUFjLENBQUMsYUFBYSxHQUFHO29CQUM3QixhQUFhLENBQUMsT0FBTyxFQUFFLENBQUM7b0JBQ3hCLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDakIsQ0FBQyxDQUFDO2dCQUNGLGNBQWMsQ0FBQyxPQUFPLENBQUM7b0JBQ3JCLGNBQWMsQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztvQkFDckMsYUFBYSxHQUFHLE9BQU8sR0FBRyxjQUFjLEdBQUcsSUFBSSxDQUFDO29CQUNoRCxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2pCLENBQUMsQ0FBQyxDQUFDO2dCQUNILE1BQU0sQ0FBQyxjQUFjLENBQUM7WUFDeEIsQ0FBQztZQUVELE1BQU0sQ0FBQTtnQkFDSixPQUFPLEVBQUcsYUFBYTthQUN4QixDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNSLENBQUMsQ0FBQyxDQUFDIn0=