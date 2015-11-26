/* global angular */

var demoApp = angular.module('demoApp', ['ngResource']);

demoApp.controller('fetchCtrl', function ($scope, $resource) {

    var User = $resource('/user/:userId', {
        userId: '@id'
    });

    $scope.fetch = function () {
        var user = User.get({'userId': 123}, function (data) {
            alert(JSON.stringify(data));
        });
    };
});

// mock part

demoApp.config(function ($provide) {
    $provide.decorator('$httpBackend', angular.mock.e2e.$httpBackendDecorator);
});

demoApp.run(function ($httpBackend) {
    var unmockedPaths = [/^\/templates\//, /^\/locale\//, /^\/i18n\//];
    // do not bother server, respond with given content
    $httpBackend.whenGET('/user/123').respond(200, {'firstName': 'Tomasz', 'lastName': 'Ducin'}, {header: 'one'});
    // do real request
    angular.forEach(unmockedPaths, function (path) {
        $httpBackend.whenGET(path).passThrough();
    });
});
