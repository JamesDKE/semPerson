'use strict';

/* Controllers */
//TEST

var personControllers = angular.module('personControllers', []);


personControllers.controller("PersonListCtrl", function ($rootScope, $scope, $http, $route) {
    var hd = {
        headers: {
            Accept: 'application/sparql-results+json',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    $scope.sparqlQuery = function () {
        var pre = 'query=PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix foaf: <http://xmlns.com/foaf/0.1/> prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> prefix owl: <http://www.w3.org/2002/07/owl#> prefix :      <http://example.org/> ';
        var q = 'SELECT * WHERE {  ?subject a foaf:Person. optional {?subject foaf:givenname ?Vorname}. optional {?subject foaf:family_name ?Nachname}.  optional {?subject foaf:nick ?Spitzname}. } LIMIT 25';



        $http.post("http://localhost:3030/test/query", pre + q, hd).
            success(function (data, status, headers, config) {

                $scope.persons = data;
                $scope.results = data["results"]["bindings"];
                $scope.head = data["head"]["vars"];
                $rootScope.persons = $scope.results;
                var sepp = angular.fromJson($scope.results);

            }).
            error(function (data, status, headers, config) {
                // log error
            });
    };
    $scope.sparqlQuery();

    $scope.notSorted = function(obj){
        if (!obj) {
            return [];
        }
        return Object.keys(obj);
    }

    $scope.addRowAsyncAsJSON = function () {
        console.log("hi im a function");
        console.log($scope.givenname);

        var pre = 'update=PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix foaf: <http://xmlns.com/foaf/0.1/> prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> prefix owl: <http://www.w3.org/2002/07/owl#> prefix :      <http://example.org/> ';
        //var q =  'SELECT * WHERE {  ?subject a foaf:Person. optional {?subject foaf:givenname ?Vorname}. optional {?subject foaf:family_name ?Nachname}.  optional {?subject foaf:nick ?Spitzname}. } LIMIT 25';

        var stmt = 'INSERT DATA {' +
            ':' + $scope.givenname + ' a foaf:Person;' +
            'foaf:family_name "' + $scope.familyname + '";' +
            'foaf:givenname "' + $scope.givenname + '";' +
            'foaf:name "' + $scope.givenname + ' ' + $scope.familyname + '";' +
            'foaf:gender "' + $scope.gender + '";' +
            'foaf:birhtday "' + $scope.birthday + '";' +
            ':address "' + $scope.address + '";' +
            'foaf:knows "' + $scope.knows + '";' +
            'foaf:workplaceHomepage "' + $scope.workplace + '";' +
            'foaf:nick  "' + $scope.nickname + '";. };';



        //$scope.companies.push({ 'name':$scope.name, 'employees': $scope.employees, 'headoffice':$scope.headoffice });
        // Writing it to the server
        //
        $http.post("http://localhost:3030/test/update", pre + stmt, hd).
            success(function (data, status, headers, config) {
                $scope.message = data;
                $route.reload();
            }).
            error(function (data, status, headers, config) {
                alert("failure message: " + JSON.stringify({data: data}));
            });

        $scope.givenname = '';
        $scope.familyname = '';
        $scope.nickname = '';


    };

    $scope.deleteRowAsyncAsJSON = function (subject) {

        var pre = 'update=PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix foaf: <http://xmlns.com/foaf/0.1/> prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> prefix owl: <http://www.w3.org/2002/07/owl#> prefix :      <http://example.org/> ';


        var stmt = 'DELETE ' +
            '{ <' + subject + '> ?p ?o }' +
            'INSERT { GRAPH <'+ subject +'Graph> ' +
            '{ <' + subject + '> ?p ?o }}' +
            'WHERE {' +
            '<' + subject + '> ?p ?o } ;';



        $http.post("http://localhost:3030/test/update", pre + stmt, hd).
            success(function (data, status, headers, config) {
                $scope.message = data;
                $route.reload();
            }).
            error(function (data, status, headers, config) {
                alert("failure message: " + JSON.stringify({data: data}));
            });

    };
});

personControllers.controller('PersonDetailCtrl', ['$rootScope', '$scope', '$routeParams','$http','$route',
    function ($rootScope, $scope, $routeParams, $http, num, $route) {

        var hd = {
            headers: {
                Accept: 'application/sparql-results+json',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };


        var pre = 'query=PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix foaf: <http://xmlns.com/foaf/0.1/> prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> prefix owl: <http://www.w3.org/2002/07/owl#> prefix :      <http://example.org/> ';
        var q = 'select *  WHERE {<http://example.org/' + $routeParams.personId + '> ?p ?o }  limit 100';

        $http.post("http://localhost:3030/test/query", pre + q, hd).
            success(function (data, status, headers, config) {

                $scope.person = data;
                $scope.result = data["results"]["bindings"];
                $scope.head = data["head"]["vars"];

                var tmp = [];
                var tmp2 = [];
                var i;
                for (i = $scope.result.length - 1; i >= 0; i--) {
                    tmp[i] = [];
                    tmp[i].property =  $scope.result[i].p.value;
                    tmp[i].value =  $scope.result[i].o.value;
                    tmp2[i] = [];
                    tmp2[i].property =  $scope.result[i].p.value;
                    tmp2[i].value =  $scope.result[i].o.value;
                    console.log('GEÄNDERT: '+tmp[i].value +' : '+tmp[i].property);
                }
                //var tmp2 = angular.copy(tmp);

                $scope.personData = tmp;

                $scope.personDataOrig = tmp2;


            }).
            error(function (data, status, headers, config) {
                // log error
            });


        $scope.modifyRow = function (subject) {
            console.log($scope.personData);


            var pre = 'update=PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix foaf: <http://xmlns.com/foaf/0.1/> prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> prefix owl: <http://www.w3.org/2002/07/owl#> prefix :      <http://example.org/> ';

            var delStr = '';
            var i;
            var stmt = '';
            var insstmt = '';
            var wherestmt = '';
            for (i = $scope.result.length - 1; i >= 0; i--) {
                if ($scope.personData[i].value != $scope.personDataOrig[i].value){
                    console.log('GEÄNDERT: '+$scope.personData[i].value +' <> '+$scope.personDataOrig[i].value);
                    if (stmt == '') {
                        stmt = ' DELETE { ';
                    }
                    if (insstmt == '') {
                        insstmt = ' INSERT { ';
                    }
                    if (wherestmt == '') {
                        wherestmt = ' WHERE { ';
                    }
                    var delimiterStart ='';
                    var delimiterEnd ='';
                    if ($scope.personDataOrig[i].value  != parseInt($scope.personDataOrig[i].value)) {
                        delimiterStart = "'";
                        delimiterEnd = "'";
                        if ($scope.personDataOrig[i].value.indexOf("http://")>-1) {
                            delimiterStart = "<";
                            delimiterEnd = ">";
                        }
                    }

                    stmt +=  '<http://example.org/' + $routeParams.personId + '> <'+ $scope.personDataOrig[i].property+"> "+delimiterStart +$scope.personDataOrig[i].value+delimiterEnd+" .";
                    insstmt += '<http://example.org/' + $routeParams.personId + '> <'+ $scope.personDataOrig[i].property+"> "+delimiterStart + $scope.personData[i].value+delimiterEnd+" .";
                    wherestmt +=  '<http://example.org/' + $routeParams.personId + '> <'+ $scope.personDataOrig[i].property+"> "+delimiterStart + $scope.personDataOrig[i].value+delimiterEnd+" .";

                    if ($scope.personData[i].value == '') {
                        insstmt = '';
                    }
                    
                }
            }
            if (stmt != '') {
                stmt += ' }';
                if (insstmt != '') {
                    stmt += insstmt + '}';
                }

                stmt += wherestmt + '}';

                console.log('Fertiges Statement: '+stmt);


                $http.post("http://localhost:3030/test/update", pre + stmt, hd).
                    success(function (data, status, headers, config) {
                        $scope.message = data;

                    }).
                    error(function (data, status, headers, config) {
                        alert("failure message: " + JSON.stringify({data: data}));
                    });
            }
        }
    }]);
