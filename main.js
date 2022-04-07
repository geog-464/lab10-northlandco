// declare the map variable here to give it a global scope
let myMap;

const StamenTerrain = L.tileLayer(
	'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png', 
	{
		attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}
)

// we might as well declare our baselayer(s) here too
const CartoDB_Positron = L.tileLayer(
	'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', 
	{
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
	}
)

function initialize(){
    loadMap();
};

function generateCircles(feature, latlng) {
	return L.circleMarker(latlng);
}

function styleAll(feature, latlng) {
	if(mapStyle == 'a'){
		
		console.log(feature.properties.ZipCode)
		
		var styles = {dashArray:null, dashOffset:null, lineJoin:null, lineCap:null, stroke:false, color:'#002', opacity:1, weight:1, fillColor:null, fillOpacity:0 };

		if (feature.geometry.type == "Point") {
			styles.fillColor = '#ff00ff'
			,styles.fillOpacity = 0.5
			,styles.stroke=true
			,styles.radius=9
			}
		if (typeof feature.properties.ZipCode == "string") {
			styles.fillColor = ' cyan'
			,styles.fillOpacity = 0.5
			,styles.stroke=true
			,styles.radius=12
			}

		return styles;
	}
	
	if(mapStyle == 'b'){
		
		var styles = {dashArray:null, dashOffset:null, lineJoin:null, lineCap:null, stroke:false, color:'#002', opacity:1, weight:1, fillColor:null, fillOpacity:0 };

		if (feature.geometry.type == "Point") {
			styles.fillColor = 'red'
			,styles.fillOpacity = 0.25
			,styles.stroke=true
			,styles.radius=18
			}
		return styles;
	}
	
}

function addPopups(feature, layer){
	if(mapStyle == 'a'){
		layer.bindPopup(feature.properties.StationNam + ", " + feature.properties.ZipCode);
	}
	
	if(mapStyle == 'b'){
		layer.bindPopup(feature.properties.city + ", " + feature.properties.pop_2018);
	}
}


//map id function
function loadMap(mapid) {
	try {
		myMap.remove()
	} catch(e) {
		console.log(e)
		console.log("no map to delete")
	} finally {
		if (mapid == 'mapa'){
			mapStyle = 'a';
			
			myMap = L.map('mapdiv', {
			center: [40, -93],
			zoom: 4,
			mazZoom: 18,
			minZoom: 2,
			layers: StamenTerrain	
		});
	
		let baseLayers = {
			"StamenTerrain": StamenTerrain, 
			"CartoDB": CartoDB_Positron
		};

		let lcontrol = L.control.layers(baseLayers);
		lcontrol.addTo(myMap);
		
		fetchData();
		}
		
		if (mapid == 'mapb'){
			mapStyle = 'b';
			
			myMap = L.map('mapdiv', {
			center: [10, 0],
			zoom: 1,
			mazZoom: 11,
			minZoom: 2,
			layers: StamenTerrain	
		});
	
		let baseLayers = {
			"StamenTerrain": StamenTerrain, 
			"CartoDB": CartoDB_Positron
		};

		let lcontrol = L.control.layers(baseLayers);
		lcontrol.addTo(myMap);
		
		fetchData();
		}
	}

};


//fetch data
function fetchData(){
    //load the data
	if (mapStyle == 'a'){
		fetch('https://raw.githubusercontent.com/geog-464/lab10/main/data/Amtrak_Stations.geojson')
			.then(function(response){
				return response.json();
			})
			.then(function(json){
				//create a Leaflet GeoJSON layer and add it to the map
				L.geoJson(json, {style: styleAll, pointToLayer: generateCircles, onEachFeature: addPopups}).addTo(myMap);
			})
	};
	
	if (mapStyle == 'b'){
		fetch('https://raw.githubusercontent.com/geog-464/lab10/main/data/megacities.geojson')
			.then(function(response){
				return response.json();
			})
			.then(function(json){
				//create a Leaflet GeoJSON layer and add it to the map
				L.geoJson(json, {style: styleAll, pointToLayer: generateCircles, onEachFeature: addPopups}).addTo(myMap);
			})
	}
}


window.onload = initialize();