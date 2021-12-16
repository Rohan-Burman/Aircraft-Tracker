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
var coordinates = [];

var currentMarkers = [];

class Graphic {
    constructor(coordinates, track, altitude, callsign, icao) {
        this.coordinates = coordinates
        this.track = track;
        this.altitude = altitude;
        this.callsign = callsign;
        this.icao = icao;

    }
    getCoordinates() {
        return this.coordinates
    }

    setCoordinates(coordinates) {
        this.coordinates = coordinates;
    }

    getTrack() {
        return this.track;
    }

    setTrack(track) {
        this.track = track;
    }

    getAltitude() {
        return this.altitude;
    }

    setAltitude(altitude) {
        this.altitude = altitude;
    }

    getCallsign() {
        return this.callsign;
    }

    setCallsign(callsign) {
        this.callsign = callsign;
    }

    getIcao() {
        return this.icao;
    }

    setIcao(icao) {
        this.icao = icao;
    }
}

/* var geojson = {
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
} */

const urlImage = "planeMarker.png";

async function removeGraphic() {
    /* if (currentMarkers !== null) {
        for (var i = currentMarkers.length - 1; i >= 0; i--) {
            currentMarkers[i].remove();
        }
    } */

    /* currentMarkers.forEach(Marker => marker.remove());
    currentMarkers */

    graphic = null;
}

async function getFlights() {
    const url = "https://opensky-network.org/api/states/all";

    // Add a layer to use the image to represent the data.
    /* */

    var response = await fetch(url);
    var data = await response.json();

    //Loops through the elements in the json response to assign needed information to geojson for each iteration.
    //console.log(data);
    for (var key in data.states) {
        //Assigning data from the API into varibles.
        icao = data.states[key][0];
        callsign = data.states[key][1]
        longitude = data.states[key][5];
        latitude = data.states[key][6];
        velocity = data.states[key][9];
        track = data.states[key][11];
        altitude = data.states[key][13];
        coordinates = [longitude, latitude];

        //Making new instance of the Graphic class and assinging variables.
        var graphic = new Graphic(coordinates, track, altitude, callsign, icao);

        //Creating a HTML class for each graphic.
        var markerGraphic = document.createElement('div')
        markerGraphic.className = "marker";

        var graphic = new mapboxgl.Marker(markerGraphic)
            .setLngLat(graphic.getCoordinates())
            .setRotation(graphic.getTrack())
            //.setRotationAlignment('map')
            .addTo(map);
        currentMarkers.push(graphic);

        //console.log(graphic.longitude, ',', graphic.latitude);
        /* console.log(graphic.track, geojson.geometry.track); */
    }

    setInterval(removeGraphic, 92000);

}

/* map.on("load", () => { getFlights() }); */
getFlights();
setInterval(getFlights, 10000); //Calls the getFlights function every 10s. Will be lowered, but currently used for testing purposes