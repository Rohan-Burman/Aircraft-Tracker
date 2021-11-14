mapboxgl.accessToken = 'pk.eyJ1IjoicmIyMyIsImEiOiJja3R4MGtlMnExN2JrMnZtcmNnY2E4c2NxIn0.FeT3uCP4BX11Nm_zsPczzw';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/rb23/ckvcr41l82igb15o20zlmtz6i', // style URL
    center: [0.0, 50.0], // starting position
    zoom: 3 // starting zoom
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


var latitude = 0;
var longitude = 0;

//Adds plane graphic to map
function addGraphic(longtitude, latitude) {
    map.on('load', () => {
        // Load an image from an external URL.
        map.loadImage(
            "https://raw.githubusercontent.com/Rohan-Burman/Aircraft-Tracker/302c32ef51d1e1582c8896b0be610763cc1e03ca/planeMarker.png?token=AWAF5T7QBPICRCEGUGNPGOLBTD5CI",
            (error, image) => {
                if (error) throw error;

                // Add the image to the map style.
                map.addImage('plane', image);

                // Add a data source containing one point feature.
                map.addSource('point', {
                    'type': 'geojson',
                    'data': {
                        'type': 'FeatureCollection',
                        'features': [{
                            'type': 'Feature',
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [longtitude, latitude]
                            }
                        }]
                    }
                });

                // Add a layer to use the image to represent the data.
                map.addLayer({
                    'id': 'points',
                    'type': 'symbol',
                    'source': 'point', // reference the data source
                    'layout': {
                        'icon-image': 'plane', // reference the image
                        'icon-size': 0.05
                    }
                });
            }
        );
    });
}

//OpenSky API url
const url = "https://opensky-network.org/api/states/all";
/* const url = "https://opensky-network.org/api/states/all?time="; */ //url for time will be used later

async function getFlights() {
    var time = Date.now(); //gets UNIX time in milliseconds.
    /* const response = await fetch((url + time)); //gets information from API at the current UNIX time.
    const data = await response.json();
    console.log(data);
    console.log(time);
    var count = Object.keys(data).length;
    console.log(count); */

    var response = await fetch(url);
    var data = await response.json();
    console.log(data);
    for (var key in data.states) {
        longtitude = data.states[key][5];
        latitude = data.states[key][6];
        console.log(key);
        console.log(longtitude);
        console.log(latitude);
        //addGraphic(longtitude, latitude);

    }
}

getFlights();
//setInterval(getFlights, 5000); //Calls the getFlights function every 10s. Will be lowered, but currently used for testing purposes