/* global angular */

var demoApp = angular.module('demoApp', ['ngResource']);

// $resource wraps responses verbosely
function strip(data) {
    return JSON.parse(JSON.stringify(data));
}

demoApp.controller('fetchCtrl', function ($scope, $resource, $http) {

    var Organizers = $resource('/organizers');

    $scope.fetchOrganizersList = function () {
        Organizers.query(function (data) {
            console.log(strip(data));
        });
    };

    //---------------------------------------------

    var Events = $resource('/events/:eventId', {
        eventId: '@id'
    });

    $scope.fetchEventsList = function () {
        Events.query({'eventId': null}, function (data) {
            console.log(strip(data));
        });
    };

    $scope.fetchEventItem = function () {
        Events.get({'eventId': $scope.eventId}, function (data) {
            console.log(strip(data));
        });
    };

    //---------------------------------------------

    $scope.fetchUnmocked = function () {
        $http({
            method: "GET",
            url: 'unmocked/file.json'
        }).then(function (response) {
            console.log(response.data);
        })
    };
});

var events = [{
    "id": 1,
    "name": "FullStack 2014",
    "date": "23-24.10.2014",
    "link": "https://skillsmatter.com/conferences/6361-fullstack-node-and-javascript-conference",
    "lorem": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam interdum ligula quis tempor posuere. Morbi sagittis ante id blandit lobortis. Nunc sollicitudin libero interdum nisi tempor, vel tempor ante ullamcorper. Nullam dictum magna nec lobortis suscipit. Integer mauris velit, finibus at tellus et, imperdiet pulvinar arcu. Vivamus dictum iaculis justo, id hendrerit turpis aliquet ut."
}, {
    "id": 2,
    "name": "FullStack 2015",
    "date": "26-28.10.2015",
    "link": "https://skillsmatter.com/conferences/6612-fullstack",
    "lorem": "Duis interdum, massa vel placerat sollicitudin, enim elit imperdiet ligula, congue molestie erat diam et augue. Praesent pellentesque fringilla bibendum. Proin et tellus a velit sagittis elementum eget in sapien. Cras nisl velit, facilisis eget tempor id, molestie imperdiet metus."
}, {
    "id": 3,
    "name": "FullStack 2016",
    "date": "13-15.07.2016",
    "link": "https://skillsmatter.com/conferences/7278-fullstack-2016-the-conference-on-javascript-node-and-internet-of-things",
    "lorem": "Maecenas quis sagittis felis. Suspendisse id rhoncus tellus. Mauris lectus augue, tincidunt non fringilla id, sodales ac ex. Nulla dictum sem a mauris sodales, sit amet eleifend purus dapibus."
}];

var organisers = [{
    "firstName": "Wendy",
    "lastName": "Devolder"
}, {
    "firstName": "Enrico",
    "lastName": "Meloni"
}];

// mock part

demoApp.config(function ($provide) {
    $provide.decorator('$httpBackend', angular.mock.e2e.$httpBackendDecorator);
});

demoApp.run(function ($httpBackend) {
    // do not bother server, respond with given content
    $httpBackend.whenGET('/events').respond(200, events, {header: 'one'});

    $httpBackend.whenGET('/organizers')
        .respond(function(method, url, data, headers, params){
            return [200, organisers, {header: 'one'}];
    });

    $httpBackend.whenGET(/events\/(.+)/)
        .respond(function(method, url, data, headers, params){
            // quick & dirty solution
            var eventId = url.split('/')[2];
            var event = events.find( el => el.id == eventId);
            return [200, event, {header: 'one'}];
    });

// Regex parameter matching - available since v1.5.1+
// see: https://docs.angularjs.org/api/ngMock/service/$httpBackend (for 1.5.1+)
/*
    $httpBackend.whenGET(/events\/(.+)/, undefined, undefined, ['eventId'])
        .respond(function(method, url, data, headers, params){
            var event = events.find( el => el.id == params.eventId);
            return [200, event, {header: 'one'}];
    });
*/

    // do real request
    var unmockedPaths = [/unmocked\//];
    angular.forEach(unmockedPaths, function (path) {
        $httpBackend.whenGET(path).passThrough();
    });
});
