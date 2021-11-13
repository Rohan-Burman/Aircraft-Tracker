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

//Add location tracking of mouse pointer for testing purposes. Will be removed in final product
// map.on('mousemove', (e) => {
//     document.getElementById("coord").innerHTML = JSON.stringify(e.lngLat.wrap());
// });

// const layerList = document.getElementById("menu");
// const inputs = layerList.getElementsByTagName("input");

// for (const input of inputs) {
//     input.onclick = (layer) => {
//         const layerId = layer.target.id;
//         map.setStyle("mapbox://styles/rb23/" + layerId);
// }
// }


// Add a new Marker.
const marker = new mapboxgl.Marker({
    color: '#F84C4C' // color it red
});

// Define the animation.
function animateMarker(timestamp) {
    const radius = 20;

    /* 
    Update the data to a new position 
    based on the animation timestamp. 
    The divisor in the expression `timestamp / 1000` 
    controls the animation speed.
    */
    marker.setLngLat([
        Math.cos(timestamp / 1000) * radius,
        Math.sin(timestamp / 1000) * radius
    ]);

    /* 
    Ensure the marker is added to the map. 
    This is safe to call if it's already added.
    */
    marker.addTo(map);

    // Request the next frame of the animation.
    requestAnimationFrame(animateMarker);
}

// Start the animation.
requestAnimationFrame(animateMarker);

map.on('load', () => {
    // Add an image to use as a custom marker
    map.loadImage(
        'planeMarker.png',
        (error, image) => {
            if (error) throw error;
            map.addImage('custom-marker', image);
            // Add a GeoJSON source with 2 points
            map.addSource('points', {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': [{
                            // feature for Mapbox DC
                            'type': 'Feature',
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [-77.03238901390978, 38.913188059745586]
                            },
                        },
                        {
                            // feature for Mapbox SF
                            'type': 'Feature',
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [-122.414, 37.776]
                            },
                        }
                    ]
                }
            });

            // Add a symbol layer
            map.addLayer({
                'id': 'points',
                'type': 'symbol',
                'source': 'points',
                'layout': {
                    'icon-image': 'custom-marker',
                    // get the title name from the source's "title" property
                    'text-field': ['get', 'title'],
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold'
                    ],
                    'text-offset': [0, 1.25],
                    'text-anchor': 'top'
                }
            });
        }
    );
});