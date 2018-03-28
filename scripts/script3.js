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


// map component
var map = L.map('map', {
	center: [12.110659, -61.685116], // default centre
	zoom: 11, // default zoom,
	defaultExtentControl: true, // default extent button
	layers: [OpenStreetMap_Mapnik]
});


// basemap control
var baseMaps = {
	"OpenStreetMap": OpenStreetMap_Mapnik,
	"OpenStreetMap HOT": OpenStreetMap_HOT,
	"OpenTopoMap": OpenTopoMap
};




// info button
var infoButton = L.control.infoButton({
    position: 'topleft',
    linkTitle: 'About',
    title: '<h2>About</h2>',
    show: true,
    html: 'GRENADAAAAAAA <p> Click outside this box to close it!'
}).addTo(map);



// ED style
var styleED = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
};

// adding geojson
var enumDist = new L.geoJson(enumdist, {
    style: styleED
});



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


var overlayMaps = {
    "Enumeration Districts": enumDist,
    "Social Vulnerability": socialVul
};


L.control.layers(baseMaps, overlayMaps).addTo(map);




