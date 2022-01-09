const express = require('express');
const mongo = require('./mongo-interface');

const router = express.Router();

router.get('/', async (req, res) => {
    
    console.log(req.query);
    let mongoQuery = {};

    if(req.query["COLLECTION"] == "anfr")
    {
        const maritime_area_value         = req.query["maritime_area"] ;
        const registration_number_value   = req.query["registration_number"] ;
        const imo_number_value            = req.query["imo_number"] ;
        const ship_name_value             = req.query["ship_name"] ;
        const mmsi_value                  = req.query["mmsi"] ;
        const shiptype_value              = req.query["shiptype"] ;

        // craft the query for the db.collection.find()
        if (maritime_area_value !== undefined && maritime_area_value !== "") {
            mongoQuery["maritime_area"] = maritime_area_value;
        }
        if (registration_number_value !== undefined && registration_number_value !== "") {
            mongoQuery["registration_number"] = registration_number_value;
        }
        if (imo_number_value !== undefined && imo_number_value !== "") {
            mongoQuery["imo_number"] = imo_number_value;
        }
        if (ship_name_value !== undefined && ship_name_value !== "") {
            mongoQuery["ship_name"] = ship_name_value;
        }
        if (mmsi_value !== undefined && mmsi_value !== "") {
            mongoQuery["mmsi"] = mmsi_value;
        }
        if (shiptype_value !== undefined && shiptype_value !== "") {
            mongoQuery["shiptype"] = shiptype_value;
        }
    }else if(req.query["COLLECTION"] == "nari_dynamic")
    {
        const sourcemmsi_value  = req.query["sourcemmsi"] ;
        const lon_value         = req.query["lon"] ;
        const lat_value         = req.query["lat"] ;
        const t_value           = req.query["t"] ;


        // craft the query for the db.collection.find()
        if (sourcemmsi_value !== undefined && sourcemmsi_value !== "") {
            mongoQuery["sourcemmsi"] = sourcemmsi_value;
        }
        if (lon_value !== undefined && lon_value !== "") {
            mongoQuery["lon"] = lon_value;
        }
        if (lat_value !== undefined && lat_value !== "") {
            mongoQuery["lat"] = lat_value;
        }
        if (t_value !== undefined && t_value !== "") {
            mongoQuery["t"] = t_value;
        }
    }
    

    console.log("Attempting to make query:");
    console.log(JSON.stringify(mongoQuery, null, '    '));
    // get the return value from the MONGO using the mongoQuery object we just created and send it
    const returnValue = await mongo.queryDatabase(collectionName=req.query["COLLECTION"],query=mongoQuery);

    // public API: allow calls from any IP
    res.set('Access-Control-Allow-Origin', '*');
    res.send(returnValue)
});

module.exports = router;