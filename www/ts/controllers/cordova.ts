
define(['app', 'js/utils/tips', 'js/utils/common', 'qrcode', 'js/directives/dmNum'], function (app, Tips, Common) {
    app.controller('cordovaCtrl', ['$scope', '$ionicHistory', 'httpRequest', '$ionicSlideBoxDelegate', '$state', '$ionicPopup', '$ionicActionSheet', '$cordovaCamera',
        '$cordovaImagePicker', '$http', '$httpParamSerializerJQLike', '$cordovaFileTransfer', '$ionicModal', function ($scope, $ionicHistory, httpRequest, $ionicSlideBoxDelegate, $state, $ionicPopup, $ionicActionSheet, $cordovaCamera, $cordovaImagePicker, $http, $httpParamSerializerJQLike, $cordovaFileTransfer, $ionicModal) {            
            $scope.getUserInfo = () => {
                var params = {
                    uid: localStorage.getItem('uid'),
                    token: localStorage.getItem('token')
                }
                httpRequest.post('api/?method=user.userInfo', params, function (xhr, data) {
                    if (data.state === 1) {
                        $scope.user = data.data;
                        localStorage.setItem('user_info', JSON.stringify(data.data))
                    } else {
                        $state.go('login')
                    }
                })
            }
            $scope.getUserInfo();

            $scope.goUserinf = function ($event) {
                var id = angular.element($event.target).attr('id');
                switch (id) {
                    case "user-img": {
                        $scope.showImgPop();
                        break;
                    }
                    case "user-help": {
                        $state.go('helpCenters', { id: 1 })
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
                        $state.go('userinfo')
                }
            }

            // 退出登錄
            $scope.doQuit = () => {
                localStorage.removeItem('uid');
                localStorage.removeItem('token');
                localStorage.removeItem('user_info');
                $state.go('login');
            }

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
                        } else if (index == 1) {
                            $scope.takePic();
                        }
                        return true;
                    }
                });
            }

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
                    $scope.upLoad("data:image/jpeg;base64," + imageData)
                }, function (err) {
                    Tips.showTips(err);
                });
            }

            $scope.imgPicker = function () {
                var options = {
                    maximumImagesCount: 1,
                    width: 800,
                    height: 800,
                    quality: 80
                };

                $cordovaImagePicker.getPictures(options)
                    .then(function (results) {
                        $scope.upLoad(results[0])
                    }, function (error) {
                        Tips.showTips(error);
                    });
            }
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
                        var userinfo = JSON.parse(localStorage.getItem('user_info'))
                        userinfo.user_img = data.data.url;
                        localStorage.setItem('user_info', JSON.stringify(userinfo));
                    } else {
                        Tips.showTips(data.msg);
                    }
                }, function (err) {
                    $scope.$emit('loadding', 'false');
                    Tips.showTips(JSON.stringify(err));
                }, function (progress) {
                    // PROGRESS HANDLING GOES HERE
                });

            }

            // 分享相關
            $scope.share = (type) => {
                var data = {
                    "title": "港彩資訊",
                    "content": `港彩資訊是壹款集歷史開獎、統計資訊、推薦數據於壹體的資訊應用。現在註冊并綁定邀請碼${$scope.user.self_code}可免費獲取5元看料積分！下載地址：http://www.1396yy.com`,
                    "imgUrl": "https://mmbiz.qlogo.cn/mmbiz/EBcDdBgibib9yMvGgOQeFWxhpSOAvicGpXKIzSVJr9xv2wRIrRk6thVRdqwRicWgnIfIoVJYBCQZmw4Yy1WlxbJZAg/0?wx_fmt=png",
                    "targetUrl": 'http://www.1396yy.com'
                }
                window.dmwechat.share(type, data, (re) => {
                    console.log(a, b, c, d);
                }, (re) => {
                    Tips.showTips(re);
                    console.log(a, b, c, d);
                })
            }
            
        }]);
});

