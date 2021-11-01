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
map.on('mousemove', (e) => {
        document.getElementById("coord").innerHTML = JSON.stringify(e.lngLat.wrap());
});

const layerList = document.getElementById("menu");
const inputs = layerList.getElementsByTagName("input");

for (const input of inputs) {
    input.onclick = (layer) => {
        const layerId = layer.target.id;
        map.setStyle("mapbox://styles/rb23/" + layerId);
    }
}
