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
                      setTimeout(function() {
                        iframe.removeEventListener('load');
                        doc.body.removeChild(iframe);
                      }, 0);
                    });
                    doc.body.appendChild(iframe);
                  }
                }
            }
        }
    })
})