define([
    'app'
], function (app) {
    app
        .directive('editDocumentTitle', function () {
        return {
            replace: false,
            scope: {
                title: '@'
            },
            restrict: 'EAC',
            link: function (scope, iElm, iAttrs, controller) {
                scope.$watch('title', function (newValue, oldValue) {
                    writeTitle(newValue || oldValue || '');
                });
                //hack微信title
                function writeTitle(title) {
                    var doc = document;
                    var body = doc.getElementsByTagName('body')[0];
                    doc.title = title;
                    if (ionic.Platform.isIOS() && APP.is_wechat) {
                        var iframe = doc.createElement("iframe");
                        iframe.title = title;
                        iframe.setAttribute("src", "img/logo.ico");
                        iframe.width = 0;
                        iframe.height = 0;
                        iframe.frameborder = "0";
                        iframe.style.display = 'none';
                        iframe.addEventListener('load', function () {
                            setTimeout(function () {
                                iframe.removeEventListener('load');
                                doc.body.removeChild(iframe);
                            }, 0);
                        });
                        doc.body.appendChild(iframe);
                    }
                }
            }
        };
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdERvY3VtZW50VGl0bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90cy9kaXJlY3RpdmVzL2VkaXREb2N1bWVudFRpdGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sQ0FBQztJQUNMLEtBQUs7Q0FDTixFQUFDLFVBQVUsR0FBRztJQUNYLEdBQUc7U0FDRixTQUFTLENBQUMsbUJBQW1CLEVBQUU7UUFDNUIsTUFBTSxDQUFBO1lBQ0YsT0FBTyxFQUFFLEtBQUs7WUFDZCxLQUFLLEVBQUU7Z0JBQ0gsS0FBSyxFQUFDLEdBQUc7YUFDWjtZQUNELFFBQVEsRUFBRSxLQUFLO1lBQ2YsSUFBSSxFQUFFLFVBQVMsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsVUFBVTtnQkFDMUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsVUFBUyxRQUFRLEVBQUUsUUFBUTtvQkFDL0MsVUFBVSxDQUFDLFFBQVEsSUFBSSxRQUFRLElBQUksRUFBRSxDQUFDLENBQUE7Z0JBQ3hDLENBQUMsQ0FBQyxDQUFDO2dCQUNILGFBQWE7Z0JBQ2Isb0JBQW9CLEtBQUs7b0JBQ3ZCLElBQUksR0FBRyxHQUFDLFFBQVEsQ0FBQztvQkFDakIsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMvQyxHQUFHLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztvQkFDbEIsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzt3QkFDNUMsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQzt3QkFDekMsTUFBTSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7d0JBQ3JCLE1BQU0sQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLGNBQWMsQ0FBQyxDQUFDO3dCQUMzQyxNQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQzt3QkFDakIsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7d0JBQ2xCLE1BQU0sQ0FBQyxXQUFXLEdBQUMsR0FBRyxDQUFDO3dCQUN2QixNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBQyxNQUFNLENBQUM7d0JBQzVCLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUU7NEJBQzlCLFVBQVUsQ0FBQztnQ0FDVCxNQUFNLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLENBQUM7Z0NBQ25DLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDOzRCQUMvQixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQ1IsQ0FBQyxDQUFDLENBQUM7d0JBQ0gsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQy9CLENBQUM7Z0JBQ0gsQ0FBQztZQUNMLENBQUM7U0FDSixDQUFBO0lBQ0wsQ0FBQyxDQUFDLENBQUE7QUFDTixDQUFDLENBQUMsQ0FBQSJ9