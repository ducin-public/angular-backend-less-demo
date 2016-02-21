/* global angular */

var demoApp = angular.module('demoApp', ['ngResource']);

demoApp.controller('fetchCtrl', function ($scope, $resource) {
    var Events = $resource('/events/:eventId', {
        eventId: '@id'
    });

    $scope.fetch = function () {
        Events.query({'eventId': 6}, function (data) {
            console.log(data);
        });
    };
});

// mock part

demoApp.config(function ($provide) {
    $provide.decorator('$httpBackend', angular.mock.e2e.$httpBackendDecorator);
});

demoApp.run(function ($httpBackend) {
    $httpBackend.whenGET('/events/6').respond(200, ['$httpBackend', 'is', 'really', 'damn', 'cool', '!'], {header: 'one'});
});
