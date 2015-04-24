'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version',
    'personControllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/persons', {
        templateUrl: 'person/person-list.html',
        controller: 'PersonListCtrl'
      }).
      when('/persons/:personId', {
        templateUrl: 'person/person-detail.html',
        controller: 'PersonDetailCtrl'
      }).
      otherwise({redirectTo: '/persons'});
}]);
