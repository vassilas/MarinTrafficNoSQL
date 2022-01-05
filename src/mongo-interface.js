const mongodb = require('mongodb');


const mongoHostName = process.env.DB_HOSTNAME;
const dbName = "simple-nodejs-mongodb-docker-app";
const url = "mongodb://" + mongoHostName + ":27017/" + dbName;

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




exports.mongoConnect = mongoConnect;
exports.mongoDisconnect = mongoDisconnect;