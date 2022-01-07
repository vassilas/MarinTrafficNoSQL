
const maritime_area= "maritime_area" 
const registration_number= "registration_number" 
const imo_number= "imo_number" 
const ship_name= "ship_name" 
const callsign= "callsign"
const mmsi= "mmsi"
const shiptype= "shiptype"
const length= "length"
const tonnage= "tonnage"
const tonnage_unit= "tonnage_unit"
const materiel_onboard= "materiel_onboard"
const atis_code= "atis_code"
const radio_license_status= "radio_license_status"
const date_first_license= "date_first_license"
const date_inactivity_license ="date_inactivity_license"


function makeApiCall() {
    
    const maritime_area_content = document.getElementById("maritime_area").value ;
    const registration_number_content = document.getElementById("registration_number").value ;
    const imo_number_content = document.getElementById("imo_number").value ;
    const ship_name_content = document.getElementById("ship_name").value ;
    const mmsi_content = document.getElementById("mmsi").value ;
    const shiptype_content = document.getElementById("shiptype").value ;
    

    const url = "http://localhost:8080/api?"+
        "maritime_area=" + maritime_area_content +
        "&registration_number=" + registration_number_content +
        "&imo_number=" + imo_number_content +
        "&ship_name=" + ship_name_content +
        "&mmsi=" + mmsi_content +
        "&shiptype=" + shiptype_content ;

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