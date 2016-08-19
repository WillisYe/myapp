define(['app', 'js/utils/tips', 'js/utils/common', 'qrcode', 'js/directives/dmNum'], function (app, Tips, Common) {
    app.controller('cordovaCtrl', ['$scope', '$ionicHistory', 'httpRequest', '$ionicSlideBoxDelegate', '$state', '$ionicPopup', '$ionicActionSheet', '$cordovaCamera',
        '$cordovaImagePicker', '$http', '$httpParamSerializerJQLike', '$cordovaFileTransfer', '$ionicModal', function ($scope, $ionicHistory, httpRequest, $ionicSlideBoxDelegate, $state, $ionicPopup, $ionicActionSheet, $cordovaCamera, $cordovaImagePicker, $http, $httpParamSerializerJQLike, $cordovaFileTransfer, $ionicModal) {
            $scope.getUserInfo = function () {
                var params = {
                    uid: localStorage.getItem('uid'),
                    token: localStorage.getItem('token')
                };
                httpRequest.post('api/?method=user.userInfo', params, function (xhr, data) {
                    if (data.state === 1) {
                        $scope.user = data.data;
                        localStorage.setItem('user_info', JSON.stringify(data.data));
                    }
                    else {
                        $state.go('login');
                    }
                });
            };
            $scope.getUserInfo();
            $scope.goUserinf = function ($event) {
                var id = angular.element($event.target).attr('id');
                switch (id) {
                    case "user-img": {
                        $scope.showImgPop();
                        break;
                    }
                    case "user-help": {
                        $state.go('helpCenters', { id: 1 });
                        break;
                    }
                    case "user-qr": {
                        $ionicModal.fromTemplateUrl("my-modal.html", {
                            scope: $scope,
                            animation: "slide-in-up"
                        }).then(function (modal) {
                            $scope.modal = modal;
                            $scope.modal.show();
                            var qrcode = new QRCode(document.getElementById("qrcode"), {
                                width: 225,
                                height: 225
                            });
                            qrcode.makeCode($scope.user.self_code);
                        });
                        $scope.closeModal = function () {
                            $scope.modal.hide();
                        };
                        //Cleanup the modal when we are done with it!
                        $scope.$on("$destroy", function () {
                            $scope.modal.remove();
                        });
                        // Execute action on hide modal
                        $scope.$on("modal.hidden", function () {
                            // Execute action
                        });
                        // Execute action on remove modal
                        $scope.$on("modal.removed", function () {
                            // Execute action
                        });
                        break;
                    }
                    default:
                        $state.go('userinfo');
                }
            };
            // 退出登錄
            $scope.doQuit = function () {
                localStorage.removeItem('uid');
                localStorage.removeItem('token');
                localStorage.removeItem('user_info');
                $state.go('login');
            };
            $scope.showImgPop = function () {
                var hideSheet = $ionicActionSheet.show({
                    buttons: [
                        { text: '<div class="c-6 text-center dm-border">相册</div>' },
                        { text: '<div class="c-6 text-center dm-border">拍照</div>' },
                        { text: '<div class="c-6 text-center">取消</div>' }
                    ],
                    buttonClicked: function (index) {
                        if (index == 0) {
                            $scope.imgPicker();
                        }
                        else if (index == 1) {
                            $scope.takePic();
                        }
                        return true;
                    }
                });
            };
            $scope.takePic = function () {
                var options = {
                    quality: 80,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.CAMERA,
                    allowEdit: true,
                    encodingType: Camera.EncodingType.JPEG,
                    targetWidth: 120,
                    targetHeight: 120,
                    popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: false,
                    correctOrientation: true
                };
                $cordovaCamera.getPicture(options).then(function (imageData) {
                    $scope.upLoad("data:image/jpeg;base64," + imageData);
                }, function (err) {
                    Tips.showTips(err);
                });
            };
            $scope.imgPicker = function () {
                var options = {
                    maximumImagesCount: 1,
                    width: 800,
                    height: 800,
                    quality: 80
                };
                $cordovaImagePicker.getPictures(options)
                    .then(function (results) {
                    $scope.upLoad(results[0]);
                }, function (error) {
                    Tips.showTips(error);
                });
            };
            $scope.upLoad = function (src) {
                var filename = src.split("/").pop();
                var postData = httpRequest.getPostParam({
                    uid: localStorage.getItem('uid'),
                    token: localStorage.getItem('token'),
                    type: 'user_img'
                });
                var options = {
                    fileKey: "user_img",
                    fileName: filename,
                    chunkedMode: false,
                    mimeType: "image/jpg",
                    params: postData
                };
                $scope.$emit('loadding', 'noBackdrop', '上传中...');
                $cordovaFileTransfer.upload(httpRequest.getBaseUrl() + 'api/?method=user.modifyUserInfo', src, options).then(function (re) {
                    $scope.$emit('loadding', 'false');
                    var data = JSON.parse(re.response);
                    if (data.state === 1) {
                        Tips.showTips('上传成功');
                        $scope.user.user_img = data.data.url;
                        var userinfo = JSON.parse(localStorage.getItem('user_info'));
                        userinfo.user_img = data.data.url;
                        localStorage.setItem('user_info', JSON.stringify(userinfo));
                    }
                    else {
                        Tips.showTips(data.msg);
                    }
                }, function (err) {
                    $scope.$emit('loadding', 'false');
                    Tips.showTips(JSON.stringify(err));
                }, function (progress) {
                    // PROGRESS HANDLING GOES HERE
                });
            };
            // 分享相關
            $scope.share = function (type) {
                var data = {
                    "title": "港彩資訊",
                    "content": "\u6E2F\u5F69\u8CC7\u8A0A\u662F\u58F9\u6B3E\u96C6\u6B77\u53F2\u958B\u734E\u3001\u7D71\u8A08\u8CC7\u8A0A\u3001\u63A8\u85A6\u6578\u64DA\u65BC\u58F9\u9AD4\u7684\u8CC7\u8A0A\u61C9\u7528\u3002\u73FE\u5728\u8A3B\u518A\u5E76\u7D81\u5B9A\u9080\u8ACB\u78BC" + $scope.user.self_code + "\u53EF\u514D\u8CBB\u7372\u53D65\u5143\u770B\u6599\u7A4D\u5206\uFF01\u4E0B\u8F09\u5730\u5740\uFF1Ahttp://www.1396yy.com",
                    "imgUrl": "https://mmbiz.qlogo.cn/mmbiz/EBcDdBgibib9yMvGgOQeFWxhpSOAvicGpXKIzSVJr9xv2wRIrRk6thVRdqwRicWgnIfIoVJYBCQZmw4Yy1WlxbJZAg/0?wx_fmt=png",
                    "targetUrl": 'http://www.1396yy.com'
                };
                window.dmwechat.share(type, data, function (re) {
                    console.log(a, b, c, d);
                }, function (re) {
                    Tips.showTips(re);
                    console.log(a, b, c, d);
                });
            };
        }]);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29yZG92YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3RzL2NvbnRyb2xsZXJzL2NvcmRvdmEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFLGVBQWUsRUFBRSxpQkFBaUIsRUFBRSxRQUFRLEVBQUUscUJBQXFCLENBQUMsRUFBRSxVQUFVLEdBQUcsRUFBRSxJQUFJLEVBQUUsTUFBTTtJQUM1RyxHQUFHLENBQUMsVUFBVSxDQUFDLGFBQWEsRUFBRSxDQUFDLFFBQVEsRUFBRSxlQUFlLEVBQUUsYUFBYSxFQUFFLHdCQUF3QixFQUFFLFFBQVEsRUFBRSxhQUFhLEVBQUUsbUJBQW1CLEVBQUUsZ0JBQWdCO1FBQzdKLHFCQUFxQixFQUFFLE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxzQkFBc0IsRUFBRSxhQUFhLEVBQUUsVUFBVSxNQUFNLEVBQUUsYUFBYSxFQUFFLFdBQVcsRUFBRSxzQkFBc0IsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLGlCQUFpQixFQUFFLGNBQWMsRUFBRSxtQkFBbUIsRUFBRSxLQUFLLEVBQUUsMEJBQTBCLEVBQUUsb0JBQW9CLEVBQUUsV0FBVztZQUN4VCxNQUFNLENBQUMsV0FBVyxHQUFHO2dCQUNqQixJQUFJLE1BQU0sR0FBRztvQkFDVCxHQUFHLEVBQUUsWUFBWSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7b0JBQ2hDLEtBQUssRUFBRSxZQUFZLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztpQkFDdkMsQ0FBQTtnQkFDRCxXQUFXLENBQUMsSUFBSSxDQUFDLDJCQUEyQixFQUFFLE1BQU0sRUFBRSxVQUFVLEdBQUcsRUFBRSxJQUFJO29CQUNyRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ25CLE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQzt3QkFDeEIsWUFBWSxDQUFDLE9B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