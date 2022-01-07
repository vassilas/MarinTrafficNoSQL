const mongodb = require('mongodb');
// const fs = require('fs');
const csvtojson = require('csvtojson');
const converter=csvtojson({delimiter:";"})

const mongoHostName = process.env.DB_HOSTNAME;
const dbName = "simple-nodejs-mongodb-docker-app";
const url = "mongodb://" + mongoHostName + ":27017/" + dbName;

const csvFileName_anfr = "./data/anfr.csv";
/**
 * This class holds anfr information.
 */
//  class anfr {
//     constructor(maritime_area, 
//             registration_number, 
//             imo_number, 
//             ship_name, 
//             callsign,
//             mmsi,
//             shiptype,
//             length,
//             tonnage,
//             tonnage_unit,
//             materiel_onboard,
//             atis_code,
//             radio_license_status,
//             date_first_license,
//             date_inactivity_license
//         ) {
//             // Entry ticks up from 0 for each entry in the database; this lets us
//             // do stuff like "select all entries divisible by n
//             this["registration_number"] = registration_number
//             this["imo_numbe"] = imo_numbe
//             this["ship_nam"] = ship_nam
//             this["callsig"] = callsig
//             this["mms"] = mms
//             this["shiptyp"] = shiptyp
//             this["lengt"] = lengt
//             this["tonnag"] = tonnag
//             this["tonnage_uni"] = tonnage_uni
//             this["materiel_onboar"] = materiel_onboar
//             this["atis_cod"] = atis_cod
//             this["radio_license_statu"] = radio_license_statu
//             this["date_first_licens"] = date_first_licens
//             this["date_inactivity_license"] = date_inactivity_license
//     }
// }

const mongoClient = new mongodb.MongoClient(url);
console.log(url)


 async function mongoConnect() {
    try {
        // wait for MongoDB connection to disconnect
        await mongoClient.connect();
        console.log("Connected to MongoDB");

    } catch (e) {
        console.log(e);
    }
}

 async function mongoDisconnect() {
    try {
        // always close connection to mongo client afterwards
        await mongoClient.close();
        console.log("Disconnected from MongoDB")

    } catch (e) {
        console.log(e);
    }
}

async function loadCSV(csvName=csvFileName_anfr) {

    arrayToInsert = [];
    const source = await converter.fromFile(csvName);
    
    // Fetching the all data from each row
    for ( i = 0; i < source.length; i++) {
        //console.debug(source[i]);
        arrayToInsert.push(source[i]);
    }

    // this is the database
    const database = mongoClient.db(dbName);
    console.debug("Created/opened database " + dbName);

    // this is the courses collection
    const collectionName = 'anfr';
    const anfrCollection = database.collection(collectionName);
    anfrCollection.remove();

    return anfrCollection.insertMany(arrayToInsert);
}


async function queryDatabase(query) {
    try {


        // wait for MongoDB connection to disconnect
        // await mongoClient.connect();
        const database = mongoClient.db(dbName);
        const collectionName = 'anfr';
        const anfrCollection = database.collection(collectionName);

        return await anfrCollection.find(query).toArray();
    } catch (e) {
        console.log(e);
    } finally {
        // always close connection to mongo client afterwards
        // await mongoClient.close();
        // console.log("Disconnected from MongoDB")
    }
}


async function readAllCollectionData(query) {
    let mongoQuery = {};
    console.log("Attempting to make query:");
    console.log(JSON.stringify(mongoQuery, null, '    '));
    
    // get the return value from the mongoLoader using the mongoQuery object we just created and send it
    const returnValue = await queryDatabase(mongoQuery);
    //console.log(returnValue);
}


exports.mongoConnect = mongoConnect;
exports.mongoDisconnect = mongoDisconnect;
exports.loadCSV = loadCSV;
exports.readAllCollectionData = readAllCollectionData;
exports.queryDatabase = queryDatabase;