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
            url: '/advanced/unmocked/file.json'
        }).then(function (response) {
            console.log(response.data);
        })
    };
});

var events = [{
    "id": 1,
    "link": "http://www.meetup.com/AngularJS-Warsaw/events/222611949/",
    "date": "02.06.2015",
    "address": "Asseco Poland S.A., Branickiego 13, Warszawa-Wilanów",
    "description": "Pierwszy AngularJS Warsaw odbędzie się w siedzibie Asseco Poland"
}, {
    "id": 2,
    "link": "http://www.meetup.com/AngularJS-Warsaw/events/224042484/",
    "date": "29.07.2015",
    "address": "Aviva, ul. Domaniewska 44, 02-672 Warszawa",
    "description": "Drugie AngularJS Warsaw odbędzie się w siedzibie Aviva"
}, {
    "id": 3,
    "link": "http://www.meetup.com/AngularJS-Warsaw/events/224789089/",
    "date": "26.08.2015",
    "address": "Aviva, ul. Domaniewska 44, 02-672 Warszawa",
    "description": "Trzeci AngularJS Warsaw odbędzie się przy piwku i pizzy"
}, {
    "id": 4,
    "link": "http://www.meetup.com/AngularJS-Warsaw/events/225840270/",
    "date": "22.10.2015",
    "address": "Aviva, ul. Domaniewska 44, 02-672 Warszawa",
    "description": "#4 spotkanie z Angularem w tle"
}, {
    "id": 5,
    "link": "http://www.meetup.com/AngularJS-Warsaw/events/226421480/",
    "date": "03.12.2015",
    "address": "Asseco w Wilanowie przy ul. Adama Branickiego 13",
    "description": "#5 spotkanie z Angularem w tle odbędzie się 3 grudnia o 19:00"
}, {
    "id": 6,
    "link": "http://www.meetup.com/AngularJS-Warsaw/events/228863948/",
    "date": "22.02.2016",
    "address": "ul. Domaniewska 44, 02-672 Warszawa",
    "description": "#6 AngularJS Warsaw odbędzie się w siedzibie Aviva (http://www.aviva.pl)"
}];

var organisers = [{
    "firstName": "Darek",
    "lastName": "Kalbarczyk"
}, {
    "firstName": "Arek",
    "lastName": "Kalbarczyk"
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
    var unmockedPaths = [/\/unmocked\//];
    angular.forEach(unmockedPaths, function (path) {
        $httpBackend.whenGET(path).passThrough();
    });
});
