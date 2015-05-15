/**
 * Created by Daniel on 14/05/15.
 */
var SparqlClient = require('sparql-client');
var util = require('util');
var endpoint = 'http://dbpedia.org/sparql';


function getLocation(company){
    var companyRecource = "<http://dbpedia.org/resource/"+company+">";

    var locations = [];

    var query = "SELECT * WHERE { "+companyRecource+" <http://dbpedia.org/property/locationCity> ?locationCity. } LIMIT 10";
    var client = new SparqlClient(endpoint);
    console.log("Query to " + endpoint);
    console.log("Query: " + query);
    client.query(query)

        .execute(function(error, results) {
            var result = (JSON.stringify(arguments, null, 20, true));

            var parsed = JSON.parse(result);
            parsed = parsed[1].results.bindings;



            for(var x in parsed){
                locations.push(parsed[x].locationCity.value);
            }

            var index;

            for (index = 0; index < locations.length; ++index) {
                console.log(locations[index]);
            }
        });

        return locations;
}

function getLocationCoordinate(locationURI){

   var coordinates = [];

   var query = "SELECT * WHERE { "+locationURI+" geo:lat ?lat } LIMIT 10";
   var client = new SparqlClient(endpoint);
    console.log("Query to " + endpoint);
    console.log("Query: " + query);
    client.query(query)

        .execute(function(error, results) {
            var result = (JSON.stringify(arguments, null, 20, true));

            var parsed = JSON.parse(result);
            coordinates[0] = parsed[1].results.bindings[0].lat.value;

            console.log(coordinates[0]);

            //console.log(result);
        });

    var query = "SELECT * WHERE { "+locationURI+" geo:long ?long } LIMIT 10";
    var client = new SparqlClient(endpoint);
    console.log("Query to " + endpoint);
    console.log("Query: " + query);
    client.query(query)

        .execute(function(error, results) {
            var result = (JSON.stringify(arguments, null, 20, true));

            var parsed = JSON.parse(result);
            coordinates[1] = parsed[1].results.bindings[0].long.value;

            console.log(coordinates[1]);

            //console.log(result);
        });

    return coordinates;
}

getLocationCoordinate("<http://dbpedia.org/resource/Armonk,_New_York"+">");
//getLocation("IBM");