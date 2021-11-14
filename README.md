# Aircraft-Tracker
CompSci A-Level Coursework


const layerList = document.getElementById("menu");
const inputs = layerList.getElementsById("input");

for (const input of inputs) {
    input.onclick = (layer) => {
        const layerId = layer.target.id;
        map.setStyle("mapbox://styles/rb23/" + layerId);
    }
}