var linkedController = angular.module('myModule', []);


linkedController.controller("myController", function ($rootScope, $scope, $http, $route) {
    var hd = {
        headers: {
            Accept: 'application/sparql-results+json',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    $scope.sparqlQueryLongitude = function () {
        var pre = 'query=PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix foaf: <http://xmlns.com/foaf/0.1/> prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> prefix owl: <http://www.w3.org/2002/07/owl#> prefix :      <http://example.org/> ';
        var locationURI = "<http://dbpedia.org/resource/"+"Arbing"+">";


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
    };
    $scope.sparqlQueryLongitude();

    $scope.sparqlQueryLatitude = function () {
        var pre = 'query=PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix foaf: <http://xmlns.com/foaf/0.1/> prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> prefix owl: <http://www.w3.org/2002/07/owl#> prefix :      <http://example.org/> ';
        var locationURI = "<http://dbpedia.org/resource/"+"Arbing"+">";


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
    };
    $scope.sparqlQueryLatitude();
});