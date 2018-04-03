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



// Social Vulnerability Layer
// popup function for SV
function popupSV(feature, layer) {
    
    var ed = feature.properties.Enum_Dist,
        parish = feature.properties.Perish,
        level = feature.properties.Rank2;
    
    var parishName = "<big>" + parish + " Parish</big><br>",
        edNum = "<b>Enumeration District: </b>" + ed + "<br>",
        trLevel = "<b>Social Vulnerability Level: </b>" + level;
    
    layer.bindPopup(parishName + edNum + trLevel);
}

// classify total_risk by equal intervals
function colourSV(tr) {
    return tr <	(0.009051 * 100) ? '#ffffe5' :
            tr < (0.015878 * 100) ? '#f7fcb9' :
            tr < (0.022704 * 100) ? '#d9f0a3' :
            tr < (0.029530 * 100) ? '#addd8e' :
            tr < (0.036357 * 100) ? '#78c679' :
            tr < (0.043183 * 100) ? '#41ab5d' :
            tr < (0.050010 * 100) ? '#238443' :
            tr < (0.056836 * 100) ? '#006837' :
            tr < (0.063663 * 100) ? '#004529' :
                            '#000000';
}

// style function
function styleSV(feature) {
    return {
        fillColor: colourSV(feature.properties.Rank2),
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



// Landslide Layer
var lopacity = 0.55;

var l1Url = 'https://q-schen.github.io/gp481/Data/Rasters/landslide1.png',
    l1Bounds = [[11.984179, -61.802838 + 0.005], [12.235563,-61.592473 + 0.005]],
    l1 = L.imageOverlay(l1Url, l1Bounds, {opacity: lopacity});

var l2Url = 'https://q-schen.github.io/gp481/Data/Rasters/landslide2.png',
    l2Bounds = [[11.984179, -61.802838 + 0.005], [12.235563,-61.592473 + 0.005]],
    l2 = L.imageOverlay(l2Url, l2Bounds, {opacity: lopacity});

var l3Url = 'https://q-schen.github.io/gp481/Data/Rasters/landslide3.png',
    l3Bounds = [[11.984179, -61.802838 + 0.005], [12.235563,-61.592473 + 0.005]],
    l3 = L.imageOverlay(l3Url, l3Bounds, {opacity: lopacity});

var landslides = L.layerGroup([l1, l2, l3]);


// SW [11.984179, -61.802838]
// NE [12.235563,-61.592473]
//  + 0.005



// Storm Surge Layer
// storm surge colours
var ssColours = ['#4292c6','#2171b5','#08519c','#08306b'];

// 3m style variable
var style3m = {
    "color": ssColours[1],
    "weight": 1.5,
    "opacity": 0.5
};

// 3m geojson
var ss_3m = new L.geoJson(stormsurge_3m, {
    style: style3m
}).bindPopup("This is 3m storm surge.");


// 6m style variable
var style6m = {
    "color": ssColours[2],
    "weight": 1.5,
    "opacity": 0.5
};

// 6m geojson
var ss_6m = new L.geoJson(stormsurge_6m, {
    style: style6m
}).bindPopup("This is 6m storm surge.");


// 9m style variable
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



// Miscellaneous Layers

// shelters layer added to map, not in the control
//var hurricaneshelters = new L.geoJson(shelters).addTo(map);




/****************************************** Adding all layers to map ******************************************/

// layers that can be toggled in the control
var overlayMaps = {
    "Overall Hazard Risk": hazardRisk,
    "Social Vulnerability": socialVul,
    "Landslides Susceptibility": landslides,
    "Storm Surge": stormsurge
};

// add all layers of the control to the map
L.control.layers(baseMaps, overlayMaps).addTo(map);



/****************************************** Legends ******************************************/

// Initializing the legends
var hrlegend = L.control({position: 'bottomright'});
var svlegend = L.control({position: 'bottomright'});
var sslegend = L.control({position: 'bottomright'});
var lslegend = L.control({position: 'bottomright'});


// Hazard Risk Legend
hrlegend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = ["Level 1", "Level 3", "Level 3", "Level 4", "Level 5", "Level 6", "Level 7", "Level 8", "Level 9"],
        colours = ['#fff7f3','#fde0dd','#fcc5c0','#fa9fb5','#f768a1','#dd3497','#ae017e','#7a0177','#49006a'],
        labels = [];

    div.innerHTML += "<b>Hazard Risk</b><br>";

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colours[i] + '"></i> ' + grades[i] + '<br>';
    }

    return div;
};

// Add Hazard Risk Legend to map
hrlegend.addTo(map);




// Social Vulnerability Legend
svlegend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = ["< 0.9051", "< 1.5878", "< 2.2704", "< 2.9530", "< 3.6357", "< 4.3183", "< 5.0010", "< 5.6836", "< 6.3663"],
        colours = ['#ffffe5','#f7fcb9','#d9f0a3','#addd8e','#78c679','#41ab5d','#238443','#006837','#004529'],
        labels = [];        
    
    div.innerHTML += "<b>Social Vulnerability</b><br>";

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colours[i] + '"></i> ' + grades[i] + '<br>';
    }

    return div;
};




// Storm Surge Legend
sslegend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = ["3m Storm Surge", "6m Storm Surge", "9m Storm Surge"],
        colours = ['#2171b5','#08519c','#08306b'],
        labels = [];

    div.innerHTML += "<b>Storm Surge</b><br>";

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colours[i] + '"></i> ' + grades[i] + '<br>';
    }

    return div;
};




// Storm Surge Legend
lslegend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = ["Low Susceptibility", "Medium Susceptibility", "High Susceptibility"],
        colours = ['#fdae61','#f46d43','#d73027'],
        labels = [];

    div.innerHTML += "<b>Landslide Susceptibility</b><br>";

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colours[i] + '"></i> ' + grades[i] + '<br>';
    }

    return div;
};




// Toggling on the legends
map.on('overlayadd', function(olayer) {
    if (olayer.name == 'Overall Hazard Risk') {
        // Hazard Risk Legend
        hrlegend.addTo(map);
    }
    
    else if (olayer.name == 'Social Vulnerability') {
        svlegend.addTo(map);
    }
    
    else if (olayer.name == 'Landslides Susceptibility') {
        lslegend.addTo(map);
    }
    
    else if (olayer.name == 'Storm Surge') {
        // bring the stormsurge group to the front
        //   with 3m on top of 6m on top of 9m
        ss_9m.bringToFront();
        ss_6m.bringToFront();
        ss_3m.bringToFront();
        
        // Storm Surge Legend
        sslegend.addTo(map);
    }
});


// Toggling off the legends
map.on('overlayremove', function(olayer) {
    if (olayer.name == 'Overall Hazard Risk') {
        map.removeControl(hrlegend);
    }
    else if (olayer.name == 'Social Vulnerability') {
        map.removeControl(svlegend);
    }
    else if (olayer.name == 'Landslides Susceptibility') {
        map.removeControl(lslegend);
    }
    else if (olayer.name == 'Storm Surge') {
        map.removeControl(sslegend);
    }
})



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


