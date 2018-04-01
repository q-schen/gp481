/****************************************** Setting Up Map Component ******************************************/

// basemap options
var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var OpenStreetMap_HOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
});

var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});


// basemap control
var baseMaps = {
	"OpenStreetMap": OpenStreetMap_Mapnik,
	"OpenStreetMap HOT": OpenStreetMap_HOT,
	"OpenTopoMap": OpenTopoMap
};




// map component
var map = L.map('map', {
	center: [12.110659, -61.685116], // default centre
	zoom: 11, // default zoom,
	defaultExtentControl: true, // default extent button
	layers: [OpenStreetMap_Mapnik]
});





// Disclaimer text for the splash
var disclaimer = "The country of Grenada is prone to many natural hazards such as flooding, mass movements and hurricanes. This project aims to identify areas at risk of these hazards due to social vulnerability and physical features of the landscape."
    + "This web map application shows the areas of risk for storm surge and landslides, as well as enumeration districts of different social vulnerability levels. These layers can be toggled on and off."
    + "<p>The web map application, under the Grenada hazard risk assessment project, is mainly to be used as a visualization tool. Generated under specific criteria, this online product should not be viewed as a substitution for government and emergency management protocol. This application is only to be used as a visualization tool or to raise public awareness. As infrastructure and other regional changes take place on the island, the risk areas and levels of risk are likely to change."
    + "<p>Click <a href ='https://q-schen.github.io/gp481/final.html' target='_blank'>here</a> to read more about the project. Click outside this box to view the map.";


// splash/info button
var infoButton = L.control.infoButton({
    position: 'topleft',
    linkTitle: 'About',
    title: '<h2>About</h2>',
    show: true,
    html: disclaimer
}).addTo(map);






/****************************************** Data Layers and Styling ******************************************/

// Parish Layer (for search function)
// deafult style
var styleParish = {
    fillColor: "black",
    fillOpacity: 0,
    weight: 0,
    opacity: 0,
    color: 'black',
    dashArray: '0'
}

// parishes geojson
var parish = new L.geoJson(parishes, {
    style: styleParish
});

map.addLayer(parish); // This enables the layer so that it is shown on map load




// Overall Hazard Risk Layer
// popup function for HR
function popupHR(feature, layer) {
    
    var ed = feature.properties.Enum_Dist,
        parish = feature.properties.Perish,
        level = feature.properties.gridcode;
    
    var parishName = "<big>" + parish + " Parish</big><br>",
        edNum = "<b>Enumeration District: </b>" + ed + "<br>",
        hrLevel = "<b>Hazard Risk Level: </b>" + level;
    
    layer.bindPopup(parishName + edNum + hrLevel);
}

// classify gridcode into 9 classes (int from 1-9)
function colourHR(gc) {
    return gc == 1 ? '#fff7f3' :
            gc == 2 ? '#fde0dd' :
            gc == 3 ? '#fcc5c0' :
            gc == 4 ? '#fa9fb5' :
            gc == 5 ? '#f768a1' :
            gc == 6 ? '#dd3497' :
            gc == 7 ? '#ae017e' :
            gc == 8 ? '#7a0177' :
            gc == 9 ? '#49006a' :
                        '#000000';
}

// style function
function styleHR(feature) {
    return {
        fillColor: colourHR(feature.properties.gridcode),
        fillOpacity: 0.55,
        weight: 0.5,
        opacity: 0.75,
        color: 'black',
        dashArray: '0'
    };
}

// total risk geojson
var hazardRisk = new L.geoJson(totalrisk, {
    style: styleHR,
    onEachFeature: popupHR
});

map.addLayer(hazardRisk); // This enables the layer so that it is shown on map load




// popup function for SV
function popupSV(feature, layer) {
    
    var ed = feature.properties.Enum_Dist,
        parish = feature.properties.Perish,
        level = feature.properties.Total_Risk;
    
    var parishName = "<big>" + parish + " Parish</big><br>",
        edNum = "<b>Enumeration District: </b>" + ed + "<br>",
        trLevel = "<b>Social Vulnerability Level: </b>" + level;
    
    layer.bindPopup(parishName + edNum + trLevel);
}

// classify total_risk by equal intervals
function colourSV(tr) {
    return tr <	0.009051 ? '#ffffe5' :
            tr < 0.015878 ? '#f7fcb9' :
            tr < 0.022704 ? '#d9f0a3' :
            tr < 0.029530 ? '#addd8e' :
            tr < 0.036357 ? '#78c679' :
            tr < 0.043183 ? '#41ab5d' :
            tr < 0.050010 ? '#238443' :
            tr < 0.056836 ? '#006837' :
            tr < 0.063663 ? '#004529' :
                            '#000000';
}

// style function
function styleSV(feature) {
    return {
        fillColor: colourSV(feature.properties.Total_Risk),
        fillOpacity: 0.55,
        weight: 0.5,
        opacity: 0.75,
        color: 'black',
        dashArray: '0'
    };
}

// social vulnerability geojson
var socialVul = new L.geoJson(socialvul, {
    style: styleSV,
    onEachFeature: popupSV
});




/*
var styleLandslide = {
    "color": "#ff7800",
    "weight": 1,
    "opacity": 0.5
};

var landslides = new L.geoJson(landslide, {
    style: styleLandslide
});
*/



// storm surge colours
var ssColours = ['#4292c6','#2171b5','#08519c','#08306b'];

// style variable
var style3m = {
    "color": ssColours[1],
    "weight": 1.5,
    "opacity": 0.5
};

// 3m geojson
var ss_3m = new L.geoJson(stormsurge_3m, {
    style: style3m
}).bindPopup("This is 3m storm surge.");


// style variable
var style6m = {
    "color": ssColours[2],
    "weight": 1.5,
    "opacity": 0.5
};

// 6m geojson
var ss_6m = new L.geoJson(stormsurge_6m, {
    style: style6m
}).bindPopup("This is 6m storm surge.");


// style variable
var style9m = {
    "color": ssColours[3],
    "weight": 1.5,
    "opacity": 0.5
};

// 9m geojson
var ss_9m = new L.geoJson(stormsurge_9m, {
    style: style9m
}).bindPopup("This is 9m storm surge.");

// create stormsurge group layer
//    so that in the control, the 3 layers are toggled together
var stormsurge = L.layerGroup([ss_9m, ss_6m, ss_3m]);





// shelters layer added to map, not in the control
//var hurricaneshelters = new L.geoJson(shelters).addTo(map);







/****************************************** Adding all layers to map ******************************************/

// layers that can be toggled in the control
var overlayMaps = {
    "Overall Hazard Risk": hazardRisk,
    "Social Vulnerability": socialVul,
    //"Landslides": landslides,
    "Storm Surge": stormsurge
};

// add all layers of the control to the map
L.control.layers(baseMaps, overlayMaps).addTo(map);


// events on enabled an overlay layer
map.on('overlayadd', function(olayer) {
    if (olayer.name == 'Storm Surge') {
        // bring the stormsurge group to the front
        //   with 3m on top of 6m on top of 9m
        ss_9m.bringToFront();
        ss_6m.bringToFront();
        ss_3m.bringToFront();
    }
});




/****************************************** Search Control ******************************************/

// create search control
var searchControl = new L.Control.Search({
	layer: parish, 
	propertyName: 'Perish', 
	initial: false,
	hideMarkerOnCollapse: true,
	textPlaceholder: 'Search Parish...'
});

// action when search is successful: open popup
searchControl.on('search:locationfound', function(event) {
    // zoom to parish
    map.fitBounds(event.layer.getBounds());
    
    // set new parish style
    event.layer.setStyle({
        fillColor: 'white',
        fillOpacity: 0,
        weight: 3,
        opacity: 0.85,
        color: 'black',
        dashArray: '2'
    });
});

// action when search control is collapsed: revert to default style
searchControl.on('search:collapsed', function(event) {
    parish.setStyle(styleParish);
});

// add search control to map
map.addControl(searchControl);


