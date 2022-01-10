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

// Disabling rotation of the map and enabling keyboard navigation controls.
map.dragRotate.disable();
map.keyboard.enable();
map.keyboard.disableRotation();

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
})


// Initalising global arrays. Each marker graphic will have its own relevant information.
/* var icao = [];
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
 */

var icao = "";
var origin = "";
var callsign = "";
var longitude = 0;
var latitude = 0;
var velocity = 0;
var track = 0;
var altitude = 0;
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

imageLink = "https://github.com/Rohan-Burman/Aircraft-Tracker/blob/main/planeMarker.png?raw=true"
map.on("load", () => {
    map.loadImage(imageLink, (error, image) => {
        if (error) 
            throw error;
        

        map.addImage,
        age("custom-marker", image);

        map.addSource("points", {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection ",
                "features": []
            }
        })
    })

    map.addLayer({
        "id": "points",
        'type': 'symbol',
        'source': 'points',
        'layout': {
            'icon-image': 'custom-marker',
            // get the title name from the source's "title" property
            'text-field': [
                'get', 'icao',
                'get', 'callsign',
                'get', 'orign',
                'get', 'coordinates',
                'get', 'velocity',
                'get', 'track',
                'get', 'altitude',

            ],
            'text-font': [
                'Open Sans Semibold', 'Arial Unicode MS Bold'
            ],
            'text-offset': [
                0, 1.25
            ],
            'text-anchor': 'top'
        }
    })
})

map.addSource("points", {
    "type": "geojson",
    "data": {
        "type": "FeatureCollection ",
        "features": []
    }
})

async function getData() {
    const url = "https://opensky-network.org/api/states/all";

    index = 0;

    var response = await fetch(url);
    var data = await response.json();

    markerJson = []
    

    // Loops throuugn the API response and assigns variables for each flight to be made into a marker graphic.
    for (index in data.states) { /*  //Assigning data from the API into arrays.
        icao[index] = data.states[index][0];
        callsign[index] = data.states[index][1]
        origin[index] = data.states[index][2];
        longitude[index] = data.states[index][5];
        latitude[index] = data.states[index][6];
        velocity[index] = data.states[index][9];
        track[index] = data.states[index][10];
        altitude[index] = data.states[index][13];

        coordinates[index] = [longitude[index], latitude[index]]; */


        icao = data.states[index][0];
        callsign = data.states[index][1]
        origin = data.states[index][2];
        longitude = data.states[index][5];
        latitude = data.states[index][6];
        velocity = data.states[index][9];
        track = data.states[index][10];
        altitude = data.states[index][13]
        coordinates = [longitude, latitude]

        obj = {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: coordinates,
                rotation: track
            },
            properties: {
                icao: icao,
                callsign: callsign,
                origin: origin,
                coordinates: coordinates,
                velocity: velocity,
                track: track,
                altitude: altitude

            }
        }
        //Append to above JSON to markerJson object
        markerJson.push(obj);

        /*  // Creating a HTML class for each marker.
        var marker = document.createElement("div");
        marker.className = "marker";

        // Creates the marker in correct position and rotation, adding it to the currentMarkers array.
        var graphic = new mapboxgl.Marker(marker).setLngLat(coordinates[index]).setRotation(track[index]).setRotationAlignment('map').addTo(map);
        currentMarkers.push(graphic); */
    }
    console.log(markerJson);
    const geojsonSource=map.getSource("points");
    geojsonSource.setData(markerJson);
    //console.log(geojsonSource);    
}


// Checks if the location of the mouse click is the same as an aircrafts location.
map.on('click', (function getLocation(e) {

    clickCoord = e.lngLat.toArray();

    clickCoord[0] = clickCoord[0].toFixed(4);
    clickCoord[1] = clickCoord[1].toFixed(4);

    console.log(clickCoord);

    // Loops through all list of coordinates and checks if the clicked location is the same
    for (index in coordinates) {
        if (coordinates[index] == clickCoord) {}
        new mapboxgl.Popup().setLngLat(clickCoord).setHTML('MATCH! You clicked here: <br/>' + clickCoord).addTo(map);
    }
}));


/* map.on("load", () => { getData() }); */
getData();
setInterval(getData, 5000); // Calls the getData function every 10s. Will be lowered, but currently used for testing purposes.
setInterval(clearMarkers, 7500);


map.on("load", () => {
    getData()
});
getData();
setInterval(getData, 5000); // Calls the getData function every 10s. Will be lowered, but currently used for testing purposes.
setInterval(clearMarkers, 7500);
