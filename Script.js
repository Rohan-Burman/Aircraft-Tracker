//Creating the map and adding controls.

mapboxgl.accessToken = 'pk.eyJ1IjoicmIyMyIsImEiOiJja3R4MGtlMnExN2JrMnZtcmNnY2E4c2NxIn0.FeT3uCP4BX11Nm_zsPczzw';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/rb23/ckvcr41l82igb15o20zlmtz6i', // style URL
    center: [0.0, 50.0], // starting position
    zoom: 3, // starting zoom
    minZoom: 1.5, // minimum zoom
});

//Disabling rotation of the map and enabling keyboard navigation controls.
map.dragRotate.disable();
map.keyboard.enable();
map.keyboard.disableRotation();

// Add geolocate control to the map.
map.addControl(
    new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        // When active the map will receive updates to the device's location as it changes.
        trackUserLocation: true,
        // Draw an arrow next to the location dot to indicate which direction the device is heading.
        showUserHeading: true
    })
);

//Add navigation controls to map.
map.addControl(new mapboxgl.NavigationControl());

// Add location tracking of mouse pointer for testing purposes. Will be removed in final product
map.on('mousemove', (e) => {
    document.getElementById("coord").innerHTML = JSON.stringify(e.lngLat.wrap());
})

//Initalising global variables. Each marker graphic will have its own relevant information.
var icao = "";
var callsign = "";
var longitude = 0;
var latitude = 0;
var velocity = "";
var track = 0;
var altitude = "";
var coordinates = [];
var currentMarkers = [];


//
function clearMarkers() {
    if (currentMarkers !== null) {
        currentMarkers.forEach((marker) => marker.remove());
        currentMarkers = [];
        delete geojson;
    }
}

//Gets data of aircraft from API, assigns it to variables and makes marker graphic.


async function getData() {
    const url = "https://opensky-network.org/api/states/all";

    key = 0;

    var response = await fetch(url);
    var data = await response.json();


    //Loops throuugn the API response and assigns variables for each flight to be made into a marker graphic.
    for (var key in data.states) {
        //Assigning data from the API into varibles.
        icao = data.states[key][0];
        callsign = data.states[key][1]
        longitude = data.states[key][5];
        latitude = data.states[key][6];
        velocity = data.states[key][9];
        track = data.states[key][10];
        altitude = data.states[key][13];

        coordinates = [longitude, latitude];

        //Creating a HTML class for each marker.
        var marker = document.createElement("div");
        marker.className = "marker";

        //Creates the marker in correct position and rotation, adding it to the currentMarkers array.
        var graphic = new mapboxgl.Marker(marker)
            .setLngLat(coordinates)
            .setRotation(track)
            .setRotationAlignment('map')
            .addTo(map);
        currentMarkers.push(graphic);
    }
}

/* map.on("load", () => { getData() }); */
getData();
setInterval(getData, 5000); //Calls the getData function every 10s. Will be lowered, but currently used for testing purposes.
setInterval(clearMarkers, 7500);


map.on("load", () => { getData() });
getData();
setInterval(getData, 5000); //Calls the getData function every 10s. Will be lowered, but currently used for testing purposes.
setInterval(clearMarkers, 7500);