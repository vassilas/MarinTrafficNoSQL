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
    

    // this is the collection
    // ----------------------------------------------
    const Collection = database.collection(collectionName);
    
    // Drop collection in order to recreate it
    // ----------------------------------------------
    console.log("Drop collection ["+collectionName+"]")
    await Collection.deleteMany({});
    
    
    // insert data to collection
    // ----------------------------------------------
    return await Collection.insertMany(arrayToInsert);
}


async function load_ANFR_Nari_Dynamic(){
    
    

    // this is the database
    // ----------------------------------------------
    const database = mongoClient.db(dbName);
    console.debug("Created/opened database " + dbName);

    // this is the collection
    // ----------------------------------------------
    collectionName="anfr_nari_dynamic"
    const Collection = database.collection(collectionName);

    // Drop collection in order to recreate it
    // ----------------------------------------------
    console.log("Drop collection ["+collectionName+"]");
    await Collection.deleteMany({});

    // Read the data from the tow collections and combine them
    // ----------------------------------------------
    all_anfr = await queryDatabase("anfr",{},"FIND");

    // insert data to collection
    // ----------------------------------------------
    arrayToInsert = []
    for(anfr in all_anfr){

        nari_dynamic_per_mmsi = await queryDatabase("nari_dynamic",{sourcemmsi:all_anfr[anfr].mmsi},"FIND");
        doc_to_insert = all_anfr[anfr]
        doc_to_insert["nari_dynamic"] = []
        for(pos in nari_dynamic_per_mmsi){
            doc_to_insert["nari_dynamic"].push(nari_dynamic_per_mmsi[pos])
        }

        arrayToInsert.push(doc_to_insert)

    }

    // INSERT data to collection 
    // ----------------------------------------------
    if(arrayToInsert.length != 0)
        return await Collection.insertMany(arrayToInsert);

}

async function load_ANFR_Nari_Dynamic_per_day(){
    
    

    // this is the database
    // ----------------------------------------------
    const database = mongoClient.db(dbName);
    console.debug("Created/opened database " + dbName);

    // this is the collection
    // ----------------------------------------------
    collectionName="anfr_nari_dynamic_per_day"
    const Collection = database.collection(collectionName);

    // Drop collection in order to recreate it
    // ----------------------------------------------
    console.log("Drop collection ["+collectionName+"]");
    await Collection.deleteMany({});

    // Read the data from the tow collections and combine them
    // ----------------------------------------------
    all_anfr = await queryDatabaseX("anfr",filter={},project={'_id': 0});

    // insert data to collection
    // ----------------------------------------------
    arrayToInsert = []
    for(anfr in all_anfr){
        
        // Find all Nari_dynamic per mmsi
        // ----------------------------------------------
        nari_dynamic_per_mmsi = await queryDatabaseX("nari_dynamic",filter={sourcemmsi:all_anfr[anfr].mmsi},project={});

        // Insert ANFR data
        // ----------------------------------------------
        doc_to_insert = all_anfr[anfr]
        
        doc_to_insert["nari_dynamic"] = []
        list_of_dates = []
        for(pos in nari_dynamic_per_mmsi){

            if( !list_of_dates.includes(nari_dynamic_per_mmsi[pos].date) ){
                doc_to_insert["nari_dynamic"].push(nari_dynamic_per_mmsi[pos])
                list_of_dates.push(nari_dynamic_per_mmsi[pos].date)
            }
        }

        arrayToInsert.push(doc_to_insert)

    }

    // INSERT data to collection 
    // ----------------------------------------------
    if(arrayToInsert.length != 0)
        return await Collection.insertMany(arrayToInsert);

}



async function load_Nari_Dynamic_per_day(){
    
    

    // this is the database
    // ----------------------------------------------
    const database = mongoClient.db(dbName);
    console.debug("Created/opened database " + dbName);

    // this is the collection
    // ----------------------------------------------
    collectionName="nari_dynamic_per_day"
    const Collection = database.collection(collectionName);

    // Drop collection in order to recreate it
    // ----------------------------------------------
    console.log("Drop collection ["+collectionName+"]");
    await Collection.deleteMany({});

    // Read the data from the tow collections and combine them
    // ----------------------------------------------
    all_nari_dynamic = await queryDatabaseX("nari_dynamic",filter={},project={'_id': 0});

    // insert data to collection
    // ----------------------------------------------
    arrayToInsert = []
    
    mmsi_list = []
    for(nari_dynamic in all_nari_dynamic){
        
        if( mmsi_list.includes(all_nari_dynamic[nari_dynamic].sourcemmsi))
            continue;

        dates_list = []

        all_nari_dynamic_mmsi = await queryDatabaseX(
            "nari_dynamic",
            filter={'sourcemmsi':all_nari_dynamic[nari_dynamic].sourcemmsi},
            project={'_id': 0});

        for(nari_dynamic_mmsi in all_nari_dynamic_mmsi){
            if( dates_list.includes(all_nari_dynamic_mmsi[nari_dynamic_mmsi].date))
                continue;

            let location = {
                type: "Point",
                coordinates: [
                    parseFloat(all_nari_dynamic_mmsi[nari_dynamic_mmsi].lon),
                    parseFloat(all_nari_dynamic_mmsi[nari_dynamic_mmsi].lat)
                ]
            };
            
            doc_to_insert = []
            doc_to_insert = all_nari_dynamic_mmsi[nari_dynamic_mmsi]
            doc_to_insert["location"] = location

            // doc_to_insert = all_nari_dynamic_mmsi[nari_dynamic_mmsi]
            arrayToInsert.push(doc_to_insert)
            
            dates_list.push(all_nari_dynamic_mmsi[nari_dynamic_mmsi].date)
        }

        mmsi_list.push(all_nari_dynamic[nari_dynamic].sourcemmsi)

    }

    // INSERT data to collection 
    // ----------------------------------------------
    if(arrayToInsert.length != 0)
        return await Collection.insertMany(arrayToInsert);

}


async function queryDatabase(collectionName,query,command) {
    try {


        // wait for MongoDB connection to disconnect
        // await mongoClient.connect();
        const database = mongoClient.db(dbName);
        const Collection = database.collection(collectionName);

        if(command == "FIND")
            return await Collection.find(query).toArray();
        else if(command == "DISTINCT"){
            results = await Collection.find(query).toArray();
            // remove duplicate sourcemmsi rows
            filteredArr = await results.reduce((acc, current) => {
                const x = acc.find(item => item.sourcemmsi === current.sourcemmsi);
                if (!x) {
                    return acc.concat([current]);
                } else {
                    return acc;
                }
              }, []);
            return filteredArr;
        }
    } catch (e) {
        console.log(e);
    } finally {
        // always close connection to mongo client afterwards
        // await mongoClient.close();
        // console.log("Disconnected from MongoDB")
    }
}


async function queryDatabaseX(collectionName,filter,project) {
    try {

        // console.log(JSON.stringify((filter,project), null, '    '));

        // wait for MongoDB connection to disconnect
        // await mongoClient.connect();
        const database = mongoClient.db(dbName);
        const Collection = database.collection(collectionName);

  
        return await Collection.find(
            filter,
            {projection: project}
            ).toArray();

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
exports.queryDatabaseX = queryDatabaseX;
exports.load_ANFR_Nari_Dynamic = load_ANFR_Nari_Dynamic;
exports.load_ANFR_Nari_Dynamic_per_day = load_ANFR_Nari_Dynamic_per_day;
exports.load_Nari_Dynamic_per_day = load_Nari_Dynamic_per_day;