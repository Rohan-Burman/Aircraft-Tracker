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
var track = 0;

class Graphic {
    constructor(longitude, latitude) {
        this.longitude = longitude;
        this.latitude = latitude;
    }

    /* //Adds plane graphic to map
    addGraphic() {
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
                                    'coordinates': [this.longitude, this.latitude]
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
    }*/
}

var geojson = {
    'type': 'Feature',
    'geometry': {
        'type': 'Point',
        'coordinates': [longitude, latitude],
        'track': track,
    }
}



//OpenSky API url
const url = "https://opensky-network.org/api/states/all";
const urlImage = "planeMarker.png";

async function getFlights() {
    var response = await fetch(url);
    var data = await response.json();
    console.log(data);
    for (var key in data.states) {
        longitude = data.states[key][5];
        latitude = data.states[key][6];
        track = data.states[key][11]

        /* if (longitude == null || longitude == null || heading == null) {
            continue
        }*/

        geojson.geometry.coordinates = [longitude, latitude];
        geojson.geometry.track = track;

        console.log(key);
        console.log(geojson.geometry.coordinates);
        console.log(geojson.geometry.track);

        /* const airMarker = document.createElement('div');
        airMarker.className = 'marker'
        airMarker.style.backgroundImage = urlImage;
        airMarker.style.backgorundSize = "100%";

        new mapboxgl.Marker(airMarker)
            .setLngLat(key.geometry.coordinates)
            .addTo(map) */

        console.log("graphic + ${key}");
        console.log(graphic);
        var graphic = graphic + key;
        var graphic = document.createElement('div')
        graphic.className = "marker";

        new mapboxgl.Marker(graphic)
            .setLngLat(geojson.geometry.coordinates)
            .setRotation(geojson.geometry.track)
            .addTo(map)

        /* var graphic = new Graphic(longitude, latitude);
        console.log(graphic.longitude);
        console.log(graphic.latitude);
        console.log(graphic);
        graphic.addGraphic(); */


    }
}

getFlights();
setInterval(getFlights, 5000); //Calls the getFlights function every 10s. Will be lowered, but currently used for testing purposes