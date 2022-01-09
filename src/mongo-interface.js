const mongodb = require('mongodb');
// const fs = require('fs');
const csvtojson = require('csvtojson');


const mongoHostName = process.env.DB_HOSTNAME;
const dbName = "marin_data";
const url = "mongodb://" + mongoHostName + ":27017/" + dbName;

const csvFileName_anfr = "./data/anfr.csv";


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

async function loadCSV(csvName=csvFileName_anfr,collectionName="anfr",csv_delimiter=",") {

    const converter=csvtojson({delimiter:csv_delimiter})
    arrayToInsert = [];
    const source = await converter.fromFile(csvName);
    
    // Fetching the all data from each row
    // ----------------------------------------------
    for ( i = 0; i < source.length; i++) {
        //console.debug(source[i]);
        arrayToInsert.push(source[i]);
    }

    // drop all databases
    // ----------------------------------------------
    // await drop_all_Databases();


    // this is the database
    // ----------------------------------------------
    const database = mongoClient.db(dbName);
    console.debug("Created/opened database " + dbName);

    
    // List of current databases
    // ----------------------------------------------
    // all_dbs = await listDatabases()
    // console.log(all_dbs)
    

    // this is the anfr collection
    // ----------------------------------------------
    const anfrCollection = database.collection(collectionName);
    
    // Drop collection in order to recreate it
    // ----------------------------------------------
    console.log("Drom collection ["+collectionName+"]")
    anfrCollection.deleteMany({});
    
    
    // insert data to anfr collection
    // ----------------------------------------------
    return await anfrCollection.insertMany(arrayToInsert);
}


async function queryDatabase(collectionName,query) {
    try {


        // wait for MongoDB connection to disconnect
        // await mongoClient.connect();
        const database = mongoClient.db(dbName);
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





async function listDatabases(){
    const database = mongoClient.db("admin");
    const all_dbs = (await database.admin().listDatabases()).databases;
    return all_dbs;
}

async function drop_all_Databases(){
    const database = mongoClient.db("admin");
    const all_dbs = (await database.admin().listDatabases()).databases;
    for( db in all_dbs ){
        if( all_dbs[db].name != "admin" && 
            all_dbs[db].name != "config" && 
            all_dbs[db].name != "local" ){
                console.log(all_dbs[db].name)
                const drop_database = mongoClient.db(all_dbs[db].name);
                await drop_database.dropDatabase();
        }
    }
}



exports.mongoConnect = mongoConnect;
exports.mongoDisconnect = mongoDisconnect;
exports.loadCSV = loadCSV;
exports.readAllCollectionData = readAllCollectionData;
exports.queryDatabase = queryDatabase;