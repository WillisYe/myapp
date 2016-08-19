

define(['ionic','asyncLoader','cordova'],function (ionic,asyncLoader,cordova) {
    var app = angular.module('app', ['ui.router','ionic','ngCordova']);

    asyncLoader.configure(app);

    return app;
});