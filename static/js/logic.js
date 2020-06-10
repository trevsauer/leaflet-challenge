// USGC earthquakes by magnitude over the last week 

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// function to set the marker size to the earthquake magnitude 
function markerSize(magnitude) {
    if (magnitude < 1) {
        return 5;
    }
    else if (magnitude < 2) {
       return 10;
    }
    else if (magnitude < 3) {
        return 20;
    }
    else if (magnitude < 4) {
        return 30;
    }
    else if (magnitude < 5) {
        return 40;
    }
    else {
        return 50;
    }
}

// function to set the marker color to the earthquake magnitude 
function markerColor(magnitude) {
    if (magnitude < 1) {
        return "#ffe6e6";
    }
    else if (magnitude < 2) {
       return "#ff8080";
    }
    else if (magnitude < 3) {
        return "#ff3333";
    }
    else if (magnitude < 4) {
        return "#cc0000";
    }
    else if (magnitude < 5) {
        return "#800000";
    }
    else {
        return "#330000";
    }
}

// use d3 to query the data from the API
d3.json(queryUrl, function(data) {
    console.log(data);

    // create function to pass in the data fields/features 
    createFeatures(data.features);
  });

// use createFeatures function to create the markers used for plotting 
 function createFeatures(earthquakeData) {

    // nested onEachFeature function to create the popup that shows individual earthquake data
    function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.title +
    "</h3><hr><p>" + new Date(feature.properties.time) + "<p>");
  }

    // nested pointToLayer function to create the markers based on the markerSize & markerColor features designated 
    function pointToLayer (feature, latlng) {
    return new L.CircleMarker(latlng, {
    radius: markerSize(feature.properties.mag),
    fillColor: markerColor(feature.properties.mag),
    color: "#000000",
    weight: 1,
    fillOpacity: 1
});
    }

// create a GeoJson layer calling both previous functions, which will use and store all necesary features for data display
  var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
      pointToLayer: pointToLayer,
      });

 // create the map 
  createMap(earthquakes);
}

// call createMap function to call earthquake data
function createMap(earthquakes) {

    // set up darkmap layer
    var darkmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/dark-v10',
        accessToken: "pk.eyJ1IjoiYWx4cHJ5IiwiYSI6ImNrYW9saHZjNDA0Z3ozMG82cHZpcm0xbm8ifQ.yM3ZhZhGelQpcJBz0wtaiw"
    });

    // set up baseMaps to store darkmap layer
    var baseMaps = {
        "Dark Map": darkmap
    };

    // set up overlayMaps 
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // set variable to store map where formatting is held
    var myMap = L.map("map", {
        center:[
            40.09, -110.71
          ],
          zoom: 5,
          layers: [darkmap, earthquakes]
        });
      
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
        }).addTo(myMap);

  // set up the legend
  var legend = L.control({ position: "bottomleft" });
  
  // add legend capabilities where color scole of the earthquake magnitude is shown 
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var magScale = [0, 1, 2, 3, 4, 5]

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < magScale.length; i++) {
        div.innerHTML +=
            '<i style="background:' + markerColor(magScale[i]) + '"></i> ' +
            magScale[i] + (magScale[i + 1] ? '&ndash;' + magScale[i + 1] + '<br>' : '+');
    }
    return div;
};

  // add legend to the map
  legend.addTo(myMap);

    }