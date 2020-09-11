const sensorURL = "http://www.purpleair.com/json?show=34579|38253|38254|34109|34747|34748|34627|38237|34691|34153|34099|27401";

require([
    "esri/Map",
    "esri/views/MapView",
    "esri/Graphic",
    "esri/layers/GraphicsLayer"
], function (Map, MapView, Graphic, GraphicsLayer) {
    const graphicsLayer = new GraphicsLayer();

    const map = new Map({
        basemap: "satellite",
        layers: [graphicsLayer]
    });

    const view = new MapView({
        container: "map-view",
        map: map,
        center: [-77.465847, 37.561295], // longitude, latitude
        zoom: 13
    });

    var point = {
        type: "point",
        longitude: -77.465847,
        latitude: 37.561295
    };

    var simpleMarkerSymbol = {
        type: "simple-marker",
        color: [226, 119, 40], // orange
        outline: {
            color: [255, 255, 255], // white
            width: 1
        }
    };

    var pointGraphic = new Graphic({
        geometry: point,
        symbol: simpleMarkerSymbol
    });

    let museumLabel = new Graphic({
        geometry: {
            type: "point",
            longitude: -77.465847,
            latitude: 37.561295
        },
        symbol: {
            type: "text", // autocasts as new TextSymbol()
            color: "white",
            haloColor: "black",
            haloSize: "1px",
            text: "Science Museum of Virginia",
            xoffset: 3,
            yoffset: 6,
            font: {
                // autocasts as new Font()
                size: 12,
                family: "Arial",
                weight: "bold"
            }
        }
    });

    graphicsLayer.add(pointGraphic);
    graphicsLayer.add(museumLabel);

    fetch(sensorURL)
        .catch(console.error)
        .then(response => response.json())
        .then(data => {
            for (const sensor of data.results) {
                createSensorPoint(graphicsLayer, sensor.Lat, sensor.Lon, sensor.PM2_5Value);
            }
        });
});

function createSensorPoint(graphicsLayer, latitude, longitude, value) {
    graphicsLayer.add({
        geometry: {
            type: "point",
            longitude,
            latitude
        },
        symbol: {
            type: "simple-marker",
            size: "64px",
            color: [226, 119, 40], // orange
            outline: {
                color: [255, 255, 255], // white
                width: 1
            }
        }
    });
    graphicsLayer.add({
        geometry: {
            type: "point",
            longitude,
            latitude
        },
        symbol: {
            type: "text", // autocasts as new TextSymbol()
            color: "white",
            haloColor: "black",
            haloSize: "1px",
            text: value,
            yoffset: -5,
            font: {
                // autocasts as new Font()
                size: 12,
                family: "Arial",
                weight: "bold"
            }
        }
    });
}