mapboxgl.accessToken = 'pk.eyJ1IjoicmIyMyIsImEiOiJja3R4MGtlMnExN2JrMnZtcmNnY2E4c2NxIn0.FeT3uCP4BX11Nm_zsPczzw';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/rb23/ckvcr41l82igb15o20zlmtz6i', // style URL
    center: [0.0, 50.0], // starting position
    zoom: 3, // starting zoom
});

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

var icao = "";
var callsign = "";
var longitude = 0;
var latitude = 0;
var velocity = "";
var track = 0;
var altitude = "";


/* class Graphic {
    constructor(longitude, latitude, track) {
        this.longitude = longitude;
        this.latitude = latitude;
        this.track = track;
    }
} */

var geojson = {
    'type': 'Feature',
    'icao': icao,
    'callsign': callsign,
    'geometry': {
        'type': 'Point',
        'coordinates': [longitude, latitude],
        'track': track,
        'velocity': velocity,
        'altitude': altitude,
    }
}



//OpenSky API url
const url = "https://opensky-network.org/api/states/all";
const urlImage = "planeMarker.png";

async function getFlights() {

    // Add a layer to use the image to represent the data.
    var points = map.addLayer({
        'id': 'points',
        'type': 'symbol',
    })

    var response = await fetch(url);
    var data = await response.json();

    //Loops through the elements in the json response to assign needed information to geojson for each iteration.
    console.log(data);
    for (var key in data.states) {
        icao = data.states[key][0];
        callsign = data.states[key][1]
        longitude = data.states[key][5];
        latitude = data.states[key][6];
        velocity = data.states[key][9];
        track = data.states[key][11];
        altitude = data.states[key][13];

        //Assigning the variables to the geojson object.
        geojson.icao = icao;
        geojson.callsign = callsign;
        geojson.geometry.coordinates = [longitude, latitude];
        geojson.geometry.track = track;
        geojson.geometry.velocity = velocity;
        geojson.geometry.altitude = altitude;


        console.log(key);
        /* console.log(geojson.geometry.coordinates);
        console.log(geojson.geometry.track); */

        var graphic = graphic;
        var graphic = document.createElement('div')
        graphic.className = "marker";

        new mapboxgl.Marker(graphic)
            .setLngLat(geojson.geometry.coordinates)
            .setRotation(geojson.geometry.track)
            .setRotationAlignment('map')
            .addTo(points)

        //var graphic = new Graphic(longitude, latitude);
        console.log(graphic.longitude);
        console.log(graphic.latitude);
        console.log(graphic);

        //graphic.addGraphic();




    }
}
async function removeGraphic() {
    map.removeLayer(points);
}

getFlights();
setInterval(removeGraphic, 9999);
setInterval(getFlights, 10000); //Calls the getFlights function every 10s. Will be lowered, but currently used for testing purposes