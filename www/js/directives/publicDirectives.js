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
                            var fn = arguments.callee;
                            setTimeout(function () {
                                iframe.removeEventListener('load', fn);
                                doc.body.removeChild(iframe);
                            }, 0);
                        });
                        doc.body.appendChild(iframe);
                    }
                }
            }
        };
    })
        .directive('dmLoadding', ['$ionicLoading', function ($ionicLoading) {
            return {
                scope: false,
                restrict: 'EAC',
                replace: false,
                link: function (scope, iElm, iAttrs, controller) {
                    function showLoadding(noBackdrop) {
                        $ionicLoading.show({
                            noBackdrop: noBackdrop,
                            template: '<div class="spinner"><div class="spinner-container container1"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div><div class="spinner-container container2"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div><div class="spinner-container container3"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div></div>'
                        });
                    }
                    scope.$watch('loadding', function (newValue, oldValue) {
                        $ionicLoading.hide();
                        if (newValue == 'false') {
                        }
                        else if (newValue == 'noBackdrop') {
                            showLoadding(true);
                        }
                        else {
                            showLoadding(false);
                        }
                    });
                }
            };
        }]);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVibGljRGlyZWN0aXZlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3RzL2RpcmVjdGl2ZXMvcHVibGljRGlyZWN0aXZlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLENBQUM7SUFDTCxLQUFLO0NBQ04sRUFBQyxVQUFVLEdBQUc7SUFDWCxHQUFHO1NBQ0YsU0FBUyxDQUFDLG1CQUFtQixFQUFFO1FBQzVCLE1BQU0sQ0FBQTtZQUNGLE9BQU8sRUFBRSxLQUFLO1lBQ2QsS0FBSyxFQUFFO2dCQUNILEtBQUssRUFBQyxHQUFHO2FBQ1o7WUFDRCxRQUFRLEVBQUUsS0FBSztZQUNmLElBQUksRUFBRSxVQUFTLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFVBQVU7Z0JBQzFDLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLFVBQVMsUUFBUSxFQUFFLFFBQVE7b0JBQy9DLFVBQVUsQ0FBQyxRQUFRLElBQUksUUFBUSxJQUFJLEVBQUUsQ0FBQyxDQUFBO2dCQUN4QyxDQUFDLENBQUMsQ0FBQztnQkFDSCxhQUFhO2dCQUNiLG9CQUFvQixLQUFLO29CQUN2QixJQUFJLEdBQUcsR0FBQyxRQUFRLENBQUM7b0JBQ2pCLElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDL0MsR0FBRyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7b0JBQ2xCLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7d0JBQzVDLElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBQ3pDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO3dCQUNyQixNQUFNLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxjQUFjLENBQUMsQ0FBQzt3QkFDM0MsTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7d0JBQ2pCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO3dCQUNsQixNQUFNLENBQUMsV0FBVyxHQUFDLEdBQUcsQ0FBQzt3QkFDdkIsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUMsTUFBTSxDQUFDO3dCQUM1QixNQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFOzRCQUM5QixJQUFJLEVBQUUsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDOzRCQUMxQixVQUFVLENBQUM7Z0NBQ1QsTUFBTSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sRUFBQyxFQUFFLENBQUMsQ0FBQztnQ0FDdEMsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7NEJBQy9CLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDUixDQUFDLENBQUMsQ0FBQzt3QkFDSCxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDL0IsQ0FBQztnQkFDSCxDQUFDO1lBQ0wsQ0FBQztTQUNKLENBQUE7SUFDTCxDQUFDLENBQUM7U0FFRCxTQUFTLENBQUMsWUFBWSxFQUFFLENBQUMsZUFBZSxFQUFDLFVBQVMsYUFBYTtZQUM1RCxNQUFNLENBQUM7Z0JBQ0gsS0FBSyxFQUFDLEtBQUs7Z0JBQ1gsUUFBUSxFQUFFLEtBQUs7Z0JBQ2YsT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsSUFBSSxFQUFFLFVBQVMsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsVUFBVTtvQkFDMUMsc0JBQXNCLFVBQVU7d0JBQzVCLGFBQWEsQ0FBQyxJQUFJLENBQUM7NEJBQ2pCLFVBQVUsRUFBQyxVQUFVOzRCQUNyQixRQUFRLEVBQUUsaWZBQWlmO3lCQUM1ZixDQUFDLENBQUM7b0JBQ1AsQ0FBQztvQkFDRCxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxVQUFTLFFBQVEsRUFBRSxRQUFRO3dCQUNsRCxhQUFhLENBQUMsSUFBSSxFQUFFLENBQUM7d0JBQ3JCLEVBQUUsQ0FBQSxDQUFDLFFBQVEsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDO3dCQUV6QixDQUFDO3dCQUFDLElBQUksQ0FBQyxFQUFFLENBQUEsQ0FBRSxRQUFRLElBQUksWUFBWSxDQUFDLENBQUMsQ0FBQzs0QkFDaEMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUN6QixDQUFDO3dCQUFDLElBQUksQ0FBQyxDQUFDOzRCQUNGLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQTt3QkFDekIsQ0FBQztvQkFDSCxDQUFDLENBQUMsQ0FBQztnQkFFUCxDQUFDO2FBQ0osQ0FBQztRQUNOLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFFUCxDQUFDLENBQUMsQ0FBQSJ9