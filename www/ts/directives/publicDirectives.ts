define([
  'app'
],function (app) {
    app
    .directive('editDocumentTitle', function(){
        return{
            replace: false,
            scope: {
                title:'@'
            },
            restrict: 'EAC',
            link: function(scope, iElm, iAttrs, controller){
                scope.$watch('title', function(newValue, oldValue) {
                  writeTitle(newValue || oldValue || '')
                });
                //hack微信title
                function writeTitle(title){
                  var doc=document;
                  var body = doc.getElementsByTagName('body')[0];
                  doc.title = title;
                  if (ionic.Platform.isIOS() && APP.is_wechat) {
                    var iframe = doc.createElement("iframe");
                    iframe.title = title;
                    iframe.setAttribute("src", "img/logo.ico");
                    iframe.width = 0;
                    iframe.height = 0;
                    iframe.frameborder="0";
                    iframe.style.display='none';
                    iframe.addEventListener('load', function() {
                      var fn = arguments.callee;
                      setTimeout(function() {
                        iframe.removeEventListener('load',fn);
                        doc.body.removeChild(iframe);
                      }, 0);
                    });
                    doc.body.appendChild(iframe);
                  }
                }
            }
        }
    })
    
    .directive('dmLoadding', ['$ionicLoading',function($ionicLoading) {
        return {
            scope:false,
            restrict: 'EAC',
            replace: false,
            link: function(scope, iElm, iAttrs, controller) {
                function showLoadding(noBackdrop) {
                    $ionicLoading.show({
                      noBackdrop:noBackdrop,
                      template: '<div class="spinner"><div class="spinner-container container1"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div><div class="spinner-container container2"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div><div class="spinner-container container3"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div></div>'
                    });
                }
                scope.$watch('loadding', function(newValue, oldValue) {
                  $ionicLoading.hide();
                  if(newValue == 'false') {
                       
                  } else if( newValue == 'noBackdrop') {
                        showLoadding(true);
                  } else {
                        showLoadding(false)
                  }
                });

            }
        };
    }])

})