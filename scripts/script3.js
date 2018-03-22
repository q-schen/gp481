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
var map = L.map('mapid', {
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

L.control.layers(baseMaps).addTo(map); 


// infobox
var InfoBox = L.control({position: 'bottomleft'});

InfoBox.onAdd = function(map){
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = '<p class="Info"><big>Grenada Hazard Risk Assessment</big><br>- Scroll to ZOOM<br>- blah blah blah</p>'
    return div;
};
InfoBox.addTo(map);

