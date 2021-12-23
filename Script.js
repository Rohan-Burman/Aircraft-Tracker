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
var icao = [];
var origin = [];
var callsign = [];
var longitude = [];
var latitude = [];
var velocity = [];
var track = [];
var altitude = [];
var coordinates = [];
var currentMarkers = [];
var clickCoord = [];


//
function clearMarkers() {
    if (currentMarkers !== null) {
        currentMarkers.forEach((marker) => marker.remove());
        currentMarkers = [];
        delete geojson;
    }
}


async function getData() {
    const url = "https://opensky-network.org/api/states/all";

    index = 0;

    var response = await fetch(url);
    var data = await response.json();


    //Loops throuugn the API response and assigns variables for each flight to be made into a marker graphic.
    for (index in data.states) {
        //Assigning data from the API into arrays.
        icao[index] = data.states[index][0];
        callsign[index] = data.states[index][1]
        origin[index] = data.states[index][2];
        longitude[index] = data.states[index][5];
        latitude[index] = data.states[index][6];
        velocity[index] = data.states[index][9];
        track[index] = data.states[index][10];
        altitude[index] = data.states[index][13];

        coordinates[index] = [longitude[index], latitude[index]];

        //Creating a HTML class for each marker.
        var marker = document.createElement("div");
        marker.className = "marker";

        //Creates the marker in correct position and rotation, adding it to the currentMarkers array.
        var graphic = new mapboxgl.Marker(marker)
            .setLngLat(coordinates[index])
            .setRotation(track[index])
            .setRotationAlignment('map')
            .addTo(map);
        currentMarkers.push(graphic);
    }
}



//Checks if the location of the mouse click is the same as an aircrafts location.
map.on('click', (function getLocation(e) {

    clickCoord = e.lngLat.toArray();

    clickCoord[0] = clickCoord[0].toFixed(4);
    clickCoord[1] = clickCoord[1].toFixed(4);

    console.log(clickCoord);

    //Loops through all list of coordinates and checks if the clicked location is the same
    for (index in coordinates) {
        if (coordinates[index] == clickCoord) {}
        new mapboxgl.Popup()
            .setLngLat(clickCoord)
            .setHTML('MATCH! You clicked here: <br/>' + clickCoord)
            .addTo(map);
    }
}));



/* map.on("load", () => { getData() }); */
getData();
setInterval(getData, 5000); //Calls the getData function every 10s. Will be lowered, but currently used for testing purposes.
setInterval(clearMarkers, 7500);


map.on("load", () => { getData() });
getData();
setInterval(getData, 5000); //Calls the getData function every 10s. Will be lowered, but currently used for testing purposes.
setInterval(clearMarkers, 7500);