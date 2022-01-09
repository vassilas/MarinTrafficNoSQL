

function makeApiCall_ANFR() {
    
    const maritime_area_content = document.getElementById("maritime_area").value ;
    const registration_number_content = document.getElementById("registration_number").value ;
    const imo_number_content = document.getElementById("imo_number").value ;
    const ship_name_content = document.getElementById("ship_name").value ;
    const mmsi_content = document.getElementById("mmsi").value ;
    const shiptype_content = document.getElementById("shiptype").value ;
    

    const url = "http://localhost:8080/api?"+
        "COLLECTION=" + "anfr" +
        "&maritime_area=" + maritime_area_content +
        "&registration_number=" + registration_number_content +
        "&imo_number=" + imo_number_content +
        "&ship_name=" + ship_name_content +
        "&mmsi=" + mmsi_content +
        "&shiptype=" + shiptype_content ;

    fetch(url).then(response => response.json()).then(data => showResults(data));
}

function makeApiCall_NARI() {
    
    const sourcemmsi_content = document.getElementById("sourcemmsi").value ;
    const lon_content = document.getElementById("lon").value ;
    const lat_content = document.getElementById("lat").value ;
    const t_content = document.getElementById("t").value ;


    const url = "http://localhost:8080/api?"+
        "COLLECTION=" + "nari_dynamic" +
        "&sourcemmsi=" + sourcemmsi_content +
        "&lon=" + lon_content +
        "&lat=" + lat_content +
        "&t=" + t_content;

    fetch(url).then(response => response.json()).then(data => showResults(data));
}


function showResults(resultsObject) {
    const resultDiv = document.getElementById('result-div');

    // remove child (if exists)
    while (resultDiv.firstChild != null) {
        resultDiv.removeChild(resultDiv.firstChild);
    }

    const paraObject = document.createElement('pre');
    paraObject.innerHTML = JSON.stringify(resultsObject, null, '    ');
    resultDiv.appendChild(paraObject);

    var tabledata = resultsObject;
    
    //initialize table
    var table = new Tabulator("#example-table", {
        data:tabledata, //assign data to table
        autoColumns:true, //create columns from data field names
    });

}

var map = L.map('map').setView([51.505, 30], 3);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 10,
    id: 'mapbox/satellite-v9',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoidmFzaWxhcyIsImEiOiJja3k2ZGZzNncwdWw3MnhvajB1aGxmZ28wIn0.e2zBM0J8qix1YIXLy35u0Q'
}).addTo(map);


// ADD VESSELS
// -----------------------------------------------------
// vessel 1
vessel_latlng = {lat:48.38249,lng:-4.4657183};
var boatMarker1 = L.boatMarker(vessel_latlng, {
    color: "#f1c40f", 	// color of the boat
    idleCircle: false	// if set to true, the icon will draw a circle if
                      // boatspeed == 0 and the ship-shape if speed > 0
}).addTo(map);
// boatMarker.setHeading(60);
// boatMarker.setHeadingWind(60, 4.5, 20);
// boatMarker.setSpeed(12.9);

// vessel 2
vessel_latlng = {lat:48.092247,lng:-4.644325};
var boatMarker2 = L.boatMarker(vessel_latlng, {
    color: "#f1c40f", 	// color of the boat
    idleCircle: false	// if set to true, the icon will draw a circle if
                      // boatspeed == 0 and the ship-shape if speed > 0
}).addTo(map);
