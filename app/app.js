'use strict';

// Declare app level module which depends on views, and components
var app = app || angular.module('myApp', [
  'ngRoute',
    'personControllers',
    'ngMap'
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

app.controller('MapCoordinatesCtrl', function($scope, $compile) {
    var TILE_SIZE = 256;

    function bound(value, opt_min, opt_max) {
        if (opt_min != null) value = Math.max(value, opt_min);
        if (opt_max != null) value = Math.min(value, opt_max);
        return value;
    }

    function degreesToRadians(deg) {
        return deg * (Math.PI / 180);
    }

    function radiansToDegrees(rad) {
        return rad / (Math.PI / 180);
    }

    function MercatorProjection() {
        this.pixelOrigin_ = new google.maps.Point(TILE_SIZE / 2, TILE_SIZE / 2);
        this.pixelsPerLonDegree_ = TILE_SIZE / 360;
        this.pixelsPerLonRadian_ = TILE_SIZE / (2 * Math.PI);
    }

    MercatorProjection.prototype.fromLatLngToPoint = function(latLng,
                                                              opt_point) {
        var me = this;
        var point = opt_point || new google.maps.Point(0, 0);
        var origin = me.pixelOrigin_;

        point.x = origin.x + latLng.lng() * me.pixelsPerLonDegree_;

        // Truncating to 0.9999 effectively limits latitude to 89.189. This is
        // about a third of a tile past the edge of the world tile.
        var siny = bound(Math.sin(degreesToRadians(latLng.lat())), -0.9999,
            0.9999);
        point.y = origin.y + 0.5 * Math.log((1 + siny) / (1 - siny)) *
            -me.pixelsPerLonRadian_;
        return point;
    };

    MercatorProjection.prototype.fromPointToLatLng = function(point) {
        var me = this;
        var origin = me.pixelOrigin_;
        var lng = (point.x - origin.x) / me.pixelsPerLonDegree_;
        var latRadians = (point.y - origin.y) / -me.pixelsPerLonRadian_;
        var lat = radiansToDegrees(2 * Math.atan(Math.exp(latRadians)) -
            Math.PI / 2);
        return new google.maps.LatLng(lat, lng);
    };

    $scope.$on('mapInitialized', function(event, map) {
        var numTiles = 1 << map.getZoom();
        var projection = new MercatorProjection();
        $scope.chicago = map.getCenter();
        $scope.worldCoordinate = projection.fromLatLngToPoint($scope.chicago);
        $scope.pixelCoordinate = new google.maps.Point(
            $scope.worldCoordinate.x * numTiles,
            $scope.worldCoordinate.y * numTiles);
        $scope.tileCoordinate = new google.maps.Point(
            Math.floor($scope.pixelCoordinate.x / TILE_SIZE),
            Math.floor($scope.pixelCoordinate.y / TILE_SIZE));
    });
});

app.controller("linkedDataCtrl", function ($rootScope, $scope, $http, $route) {
    var hd = {
        headers: {
            Accept: 'application/sparql-results+json',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    $scope.sparqlQueryLongitude = function (loc) {
        var pre = 'query=PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix foaf: <http://xmlns.com/foaf/0.1/> prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> prefix owl: <http://www.w3.org/2002/07/owl#> prefix :      <http://example.org/> ';        var locationURI = "<http://dbpedia.org/resource/"+$scope.loc+">";

        var locationURI = "<http://dbpedia.org/page/"+loc+">";

        var req = {
            method: 'GET',
            url: 'http://dbpedia.org/sparql',
            headers: { 'Content-type' : 'application/x-www-form-urlencoded',
                'Accept' : 'application/sparql-results+json' },
            params: {
                query : "SELECT * WHERE { "+locationURI+" geo:long ?long} LIMIT 10",
                format: "json"
            }
        };

        console.log(req);

        $http(req).success(function(data) {
            console.log(data);
            var longi = JSON.stringify(data);
            var longi = JSON.parse(longi);
            $scope.long = longi.results.bindings[0].long.value;
        });
        //$scope.long = 14.290556;
    };
    //$scope.sparqlQueryLongitude();

    $scope.sparqlQueryLatitude = function (loc) {
        var pre = 'query=PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix foaf: <http://xmlns.com/foaf/0.1/> prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> prefix owl: <http://www.w3.org/2002/07/owl#> prefix :      <http://example.org/> ';

        var locationURI = "<http://dbpedia.org/page/"+loc+">";

        var req = {
            method: 'GET',
            url: 'http://dbpedia.org/sparql',
            headers: { 'Content-type' : 'application/x-www-form-urlencoded',
                'Accept' : 'application/sparql-results+json' },
            params: {
                query : "SELECT * WHERE { "+locationURI+" geo:lat ?lat} LIMIT 10",
                format: "json"
            }
        };

        console.log(req);

        $http(req).success(function(data) {
            console.log(data);
            var lati = JSON.stringify(data);
            var lati = JSON.parse(lati);
            $scope.lat = lati.results.bindings[0].lat.value;
        });
        //$scope.lat = 48.303056;
    };
    //$scope.sparqlQueryLatitude();
});