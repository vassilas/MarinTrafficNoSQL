const express = require('express');
const mongo = require('./src/mongo-interface')
const api = require('./src/api');


// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();

// Connect to MongoDB
mongo.mongoConnect().then(()=>{
    mongo.loadCSV(csvName="./data/anfr_sample_2.csv",collectionName="anfr",csv_delimiter=",").then(()=>{
        console.log("ANFR Data loaded to mongoDB");
        mongo.loadCSV("./data/nari_dynamic_sample_2.csv","nari_dynamic").then(()=>{
            console.log("NARI_DYNAMIC Data loaded to mongoDB");
            mongo.load_ANFR_Nari_Dynamic().then(()=>{
                console.log("ANFR_NARI_DYNAMIC Data loaded to mongoDB");
            })
        })
    })    
});

// get the API routing started
app.use('/api', api);

// use the public directory to serve static html files
app.use(express.static('public'));

app.get('/index.htm', function (req, res) {
    res.sendFile( __dirname + "/" + "index.htm" );
})


app.listen(PORT, HOST, () => {
    console.log(`App listening on port ${PORT}`);
});

