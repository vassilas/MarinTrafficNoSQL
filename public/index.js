

function makeApiCall_ANFR() {
    
    const maritime_area_content = document.getElementById("maritime_area").value ;
    const registration_number_content = document.getElementById("registration_number").value ;
    const imo_number_content = document.getElementById("imo_number").value ;
    const ship_name_content = document.getElementById("ship_name").value ;
    const mmsi_content = document.getElementById("mmsi").value ;
    const shiptype_content = document.getElementById("shiptype").value ;
    

    url = "http://localhost:8080/api?"+
        "COLLECTION=" + "anfr"+
        "&OPTIONS="+"FIND";
        if(maritime_area_content!="")
            url += "&maritime_area=" + maritime_area_content;
        if(registration_number_content!="")
            url += "&registration_number=" + registration_number_content;
        if(imo_number_content!="")
            url += "&imo_number=" + imo_number_content;
        if(ship_name_content!="")
            url += "&ship_name=" + ship_name_content;
        if(mmsi_content!="")
            url += "&mmsi=" + mmsi_content;
        if(shiptype_content!="")
            url += "&shiptype=" + shiptype_content;

    fetch(url).then(response => response.json()).then(data => showResults(data));
}

function makeApiCall_NARI() {
    
    const sourcemmsi_content = document.getElementById("sourcemmsi").value ;
    const lon_content = document.getElementById("lon").value ;
    const lat_content = document.getElementById("lat").value ;
    const t_content = document.getElementById("t").value ;


    url = "http://localhost:8080/api?"+
        "COLLECTION=" + "nari_dynamic" +
        "&OPTIONS="+"FIND";
        if(sourcemmsi_content!="")
            url += "&sourcemmsi=" + sourcemmsi_content;
        if(lon_content!="")
            url += "&lon=" + lon_content;
        if(lat_content!="")
            url += "&lat=" + lat_content;
        if(t_content!="")
            url += "&t=" + t_content;


    fetch(url).then(response => response.json()).then(data => showResults(data));
}

function makeApiCall_ShipsPosition(){

    const date_content = document.getElementById("date").value ;
    document.getElementById("Timestamp").innerHTML = date_content;

    collection = "nari_dynamic_per_day"
    filter = "{\"date\" : \""+date_content+"\"}"
    project = "{}"
    query_text.innerHTML = "["+collection+"] : "+filter + "," + project
    query_text_description.innerHTML = "Find all ship locations of date 2015-12-27"
    _query = "COLLECTION=" + collection  + 
            "&filter="+ filter + 
            "&project="+ project;

    url = "http://localhost:8080/api/query?" + _query;

    fetch(url).then(response => response.json())
    .then(data => {
        showResults(data)

        // REMOVE ALL MARKERS
        markers.forEach(marker => marker.remove());

        // ADD SHIPS TO MAP
        for(i in data){ 
            vessel_latlng = {lat:data[i].lat,lng:data[i].lon};
            var boatMarker = L.boatMarker(vessel_latlng, {
                color: "#f1c40f", 	// color of the boat
                idleCircle: false,	// if set to true, the icon will draw a circle if
                                  // boatspeed == 0 and the ship-shape if speed > 0
                vesselInfo: data[i].sourcemmsi
            }).addTo(map);
            
            // set heading
            heading = data[i].trueheading
            if(heading == 511)
                heading = 0
            boatMarker.setHeading(heading);
 
            // POPUP for Vessel Info
            boatMarker.bindPopup(
                "mmsi: " + data[i].sourcemmsi +" <br>"+
                "time: " + data[i].time
            );
            // .on('click', function(e) {
            //     console.log("click");
            // });

            

            markers.push(boatMarker)
        }

        // CLICK ON MARKER EVENT
        markers.forEach(marker => marker.on("click", function(e) {
            
                console.log(marker);
                // console.log(marker.options.vesselInfo);
                // marker.remove()


                collection = "nari_dynamic_per_day"
                // {"location.coordinates":{$near:{$geometry:{type: "Point", coordinates: [-3.4032934,47.150867]},$maxDistance:10000}}}
                filter = "{\"date\" : \""+date_content+"\",\"location.coordinates\":{\"\$near\":{\"\$geometry\":{\"type\": \"Point\", \"coordinates\": ["+marker._latlng.lng+","+marker._latlng.lat+"]},\"\$maxDistance\":30000}}}"
                project = "{}"
                query_text.innerHTML = "["+collection+"] : "+filter + "," + project
                query_text_description.innerHTML = "Find all ship locations near to [-3.4032934,47.150867] with max Distance 10000"
                _query = "COLLECTION=" + collection  + 
                    "&filter="+ filter + 
                    "&project="+ project;
                
                console.log(_query)

                url = "http://localhost:8080/api/query?" + _query;
                fetch(url).then(response => response.json()).then(data => {
                    
                    console.log(data)
                    
                    for(i in data){ 
                        vessel_latlng = {lat:data[i].lat,lng:data[i].lon};

                        markers.forEach(marker => function(e) {
                            if(data[i].sourcemmsi == marker.options.vesselInfo)
                                marker.remove()
                        });

                        var boatMarker = L.boatMarker(vessel_latlng, {
                            color: "#ff0000", 	// color of the boat
                            idleCircle: false,	// if set to true, the icon will draw a circle if
                                              // boatspeed == 0 and the ship-shape if speed > 0
                            vesselInfo: data[i].sourcemmsi
                        }).addTo(map);
                        
                        // set heading
                        heading = data[i].trueheading
                        if(heading == 511)
                            heading = 0
                        boatMarker.setHeading(heading);
             
                        // POPUP for Vessel Info
                        boatMarker.bindPopup(
                            "mmsi: " + data[i].sourcemmsi +" <br>"+
                            "time: " + data[i].time
                        );
                        
            
                        markers.push(boatMarker)
                    }
                    
                });
            })
        );

    

    });
}

function makeApiCall_ShipMovement(){
    console.log("makeApiCall_ShipMovement");
    const ship_mmsi_content = document.getElementById("ship_mmsi").value ;


    url = "http://localhost:8080/api?"+
        "COLLECTION=" + "anfr_nari_dynamic" +
        "&OPTIONS="+"FIND";
    if(ship_mmsi_content != "")
        url += "&mmsi="+ship_mmsi_content
    else{
        return
    }

    fetch(url).then(response => response.json())
    .then(data => {

        positions = data[0].nari_dynamic
        for(let i = 0; i < positions.length ; i++){
            // console.log(positions[pos])
            setTimeout(function () {
                console.log(positions[i]);
                
                // REMOVE ALL MARKERS
                markers.forEach(marker => marker.remove());
                
                vessel_latlng = {lat:positions[i].lat,lng:positions[i].lon};
                var boatMarker = L.boatMarker(vessel_latlng, {
                    color: "#f1c40f", 	// color of the boat
                    idleCircle: false,	// if set to true, the icon will draw a circle if
                                      // boatspeed == 0 and the ship-shape if speed > 0
                    vesselInfo: positions[i].sourcemmsi
                }).addTo(map);
                
                // set heading
                heading = positions[i].trueheading
                if(heading == 511)
                    heading = 0
                boatMarker.setHeading(heading);
     
                // POPUP for Vessel Info
                boatMarker.bindPopup(
                    "mmsi: " + positions[i].sourcemmsi +" <br>"+
                    "time: " + positions[i].time
                );
                // .on('click', function(e) {
                //     console.log("click");
                // });
    
                document.getElementById("Timestamp").innerHTML = positions[i].TimeStamp;
                markers.push(boatMarker)


            }, 1000 * i);
        }
    });
    

}

function makeApiCall_MongoQuery(test) {
    
    const query_text = document.getElementById('query_text');
    const query_text_description = document.getElementById('query_text_description');

    switch(test){

        case 1:
        // ============================================================
            collection = "anfr_nari_dynamic_per_day"
            filter = "{\"registration_number\" : \"734518P\"}"
            project = "{}"
            query_text.innerHTML = "["+collection+"] : "+filter + "," + project
            query_text_description.innerHTML = "Search by Registration Number the anfr_nari_dynamic_per_day collection and show all the data"
            _query = "COLLECTION=" + collection  + 
                    "&filter="+ filter + 
                    "&project="+ project;
            break;
        case 2:
        // ============================================================
            collection = "nari_dynamic_per_day"
            filter = "{\"sourcemmsi\" : \"228364000\"}"
            project = "{}"
            query_text.innerHTML = "["+collection+"] : "+filter + "," + project
            query_text_description.innerHTML = "Find all locations of mmsi 228364000 per date"
            _query = "COLLECTION=" + collection  + 
                    "&filter="+ filter + 
                    "&project="+ project;
            break;
        case 3:
        // ============================================================
            collection = "nari_dynamic_per_day"
            filter = "{\"date\" : \"2015-12-01\"}"
            project = "{}"
            query_text.innerHTML = "["+collection+"] : "+filter + "," + project
            query_text_description.innerHTML = "Find all ship locations of date 2015-12-27"
            _query = "COLLECTION=" + collection  + 
                    "&filter="+ filter + 
                    "&project="+ project;
            break;
        case 4:
        // ============================================================
            collection = "nari_dynamic_per_day"
            // {"location.coordinates":{$near:{$geometry:{type: "Point", coordinates: [-3.4032934,47.150867]},$maxDistance:10000}}}
            filter = "{\"location.coordinates\":{\"\$near\":{\"\$geometry\":{\"type\": \"Point\", \"coordinates\": [-3.4032934,47.150867]},\"\$maxDistance\":10000}}}"
            project = "{}"
            query_text.innerHTML = "["+collection+"] : "+filter + "," + project
            query_text_description.innerHTML = "Find all ship locations near to [-3.4032934,47.150867] with max Distance 10000"
            _query = "COLLECTION=" + collection  + 
                    "&filter="+ filter + 
                    "&project="+ project;
        default:

        
    }


    url = "http://localhost:8080/api/query?" + _query;
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
        pagination:"local",
        paginationSize:5,
        paginationSizeSelector:[5,10,15,20],
    });

}

var map = L.map('map').setView([48.43845,-4.8407316], 6);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery ?? <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 20,
    id: 'mapbox/satellite-v9',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoidmFzaWxhcyIsImEiOiJja3k2ZGZzNncwdWw3MnhvajB1aGxmZ28wIn0.e2zBM0J8qix1YIXLy35u0Q'
}).addTo(map);


// ADD VESSELS
// -----------------------------------------------------
markers = [];
makeApiCall_ShipsPosition()
