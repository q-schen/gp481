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
    + "<p>Click <a href ='https://q-schen.github.io/gp481/index1.html' target='_blank'>here</a> to read more about the project. Click outside this box to view the map.";


// splash/info button
var infoButton = L.control.infoButton({
    position: 'topleft',
    linkTitle: 'About',
    title: '<h2>About</h2>',
    show: true,
    html: disclaimer
}).addTo(map);




/****************************************** Data Layers and Styling ******************************************/

/*
// ED style
var styleED = {
    "color": "#ff7800",
    "weight": 1,
    "opacity": 0.5
};

// adding geojson
var enumDist = new L.geoJson(enumdist, {
    style: styleED
});
*/

var styleTR = {
    "color": "#756bb1",
    "weight": 1,
    "opacity": 0.5
};

// adding geojson
var totalRisk = new L.geoJson(totalrisk, {
    style: styleTR
});


map.addLayer(totalRisk); // This enables the layer so that it is shown on map load




// social vulnerability style functions
function colourSV(tr) {
    return tr <	0.0049326 ? '#ffffff' :
            tr < 0.0062438 ? '#fff7ec' :
            tr < 0.0077033 ? '#fee8c8' :
            tr < 0.0086463 ? '#fdd49e' :
            tr < 0.009941 ? '#fdbb84' :
            tr < 0.0113029 ? '#fc8d59' :
            tr < 0.0129887 ? '#ef6548' :
            tr < 0.0149323 ? '#d7301f' :
            tr < 0.0179384 ? '#b30000' :
            tr < 0.0636626 ? '#7f0000' :
                            '#FFEDA0';
}


function styleSV(feature) {
    return {
        fillColor: colourSV(feature.properties.Total_Risk),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}


var socialVul = new L.geoJson(socialvul, {
    style: styleSV
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



var style3m = {
    "color": "#6baed6",
    "weight": 1.5,
    "opacity": 0.65
};

var ss_3m = new L.geoJson(stormsurge_3m, {
    style: style3m
});



var style6m = {
    "color": "#3182bd",
    "weight": 1.5,
    "opacity": 0.65
};

var ss_6m = new L.geoJson(stormsurge_6m, {
    style: style6m
});



var style9m = {
    "color": "#08519c",
    "weight": 1.5,
    "opacity": 0.65
};

var ss_9m = new L.geoJson(stormsurge_9m, {
    style: style9m
});


var stormsurge = L.layerGroup([ss_9m,ss_6m,ss_3m]);




var hurricaneshelters = new L.geoJson(shelters).addTo(map);




/****************************************** Adding all layers to map ******************************************/

var overlayMaps = {
    "Overall Hazard Risk": totalRisk,
    "Social Vulnerability": socialVul,
    //"Landslides": landslides,
    "Storm Surge": stormsurge
};


L.control.layers(baseMaps, overlayMaps).addTo(map);




