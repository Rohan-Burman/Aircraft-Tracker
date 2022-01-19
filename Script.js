// Creating the map and adding controls.
mapboxgl.accessToken = 'pk.eyJ1IjoicmIyMyIsImEiOiJja3R4MGtlMnExN2JrMnZtcmNnY2E4c2NxIn0.FeT3uCP4BX11Nm_zsPczzw';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/rb23/ckvcr41l82igb15o20zlmtz6i', // style URL
    center: [
        0.0, 50.0
    ], // starting position
    zoom: 3, // starting zoom
    minZoom: 1.5, // minimum zoom
});

map.on("load", () => {
    // Disabling rotation of the map and enabling keyboard navigation controls.
    map.dragRotate.disable();
    map.keyboard.enable();
    map.keyboard.disableRotation();

    //Add Geocoding control.
    const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken, // Set the access token
        mapboxgl: mapboxgl, // Set the mapbox-gl instance
        marker: true, // Use the geocoder's default marker style
    });

    map.addControl(geocoder, 'top-right');

    // Add geolocate control to the map.
    map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        // When active the map will receive updates to the device's location as it changes.
        trackUserLocation: true,
        // Draw an arrow next to the location dot to indicate which direction the device is heading.
        showUserHeading: true
    }));

    // Add navigation controls to map.
    map.addControl(new mapboxgl.NavigationControl());

    // Add location tracking of mouse pointer for testing purposes. Will be removed in final product
    map.on('mousemove', (e) => {
        document.getElementById("coord").innerHTML = JSON.stringify(e.lngLat.wrap());
    });
});


var currentMarkers = [];
var clickCoord = [];
var time = new Date();

function clearMarkers() {
    if (currentMarkers !== null) {
        currentMarkers.forEach((marker) => marker.remove());
        currentMarkers = [];
        //delete geojson;
    }
    console.log("Cleared markers // Timestamp: " + time.getTime());
}


async function getData() {
    console.log("Getting markers... // Timestamp: " + time.getTime());

    var icao = "";
    var origin = "";
    var callsign = "";
    var longitude = 0;
    var latitude = 0;
    var velocity = 0;
    var track = 0;
    var altitude = 0;
    var coordinates = [];
    const url = "https://opensky-network.org/api/states/all";

    index = 0;
    var geojson = {
        "type": "FeatureCollection",
        "features": []
    };

    var parsed = new Array();
    parsed = geojson.features;

    var response = await fetch(url);
    var data = await response.json();



    // Loops throuugn the API response and assigns variables for each flight to be made into a marker graphic.
    for (index in data.states) {
        icao = data.states[index][0].toUpperCase();
        callsign = data.states[index][1]
        origin = data.states[index][2];
        longitude = data.states[index][5];
        latitude = data.states[index][6];
        velocity = data.states[index][9];
        track = data.states[index][10];
        altitude = data.states[index][13]
        coordinates = [longitude, latitude];

        obj = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [longitude, latitude]
            },
            "properties": {
                "icao": icao,
                "callsign": callsign,
                "origin": origin,
                "coordinates": coordinates,
                "velocity": velocity,
                "track": track,
                "altitude": altitude,
                "description": "ICAO: " + icao + "\nCallsign: " + callsign + "\nOrigin: " + origin + "\nLatitude: " + coordinates[0] + "DD\nLongtitude: " + coordinates[1] + "DD\nVelocity: " + velocity + "m/s\nTrack: " + track + "DD\nAltitude: " + altitude + "m"

            }
        }


        objJson = JSON.parse(JSON.stringify(obj));

        //Append to above JSON to geojson object
        parsed.push(objJson);

    }

    for (var feature of geojson.features) {
        var marker = document.createElement('div');
        marker.className = 'mapboxgl-marker';
        //DOES NOT WORK

        var graphic =
            new mapboxgl.Marker(marker)
            .setLngLat(feature.geometry.coordinates)
            .setRotation(feature.properties.track)
            .setRotationAlignment('map')
            .setPopup(
                new mapboxgl.Popup({ offset: 10, className: "popups" }) // add popups
                .setHTML(
                    `<h3>${feature.properties.description}</h3>`
                ))
            .addTo(map);
        currentMarkers.push(graphic);

    }

}


map.on("load", () => {
    getData()
});
setInterval(getData, 5000); // Calls the getData function every 5s. Will be lowered, but currently used for testing purposes.

setInterval(clearMarkers, 10000); // Calls the clearMarkers function every 10s.