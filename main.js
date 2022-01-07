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
    console.log("Connected to MongoDB")
    return mongo.loadCSV()
}).then(() => {
    console.log("Data loaded to mongoDB")
}).catch(error => {
    console.error(error)
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

