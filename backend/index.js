const express = require("express");
const fs = require('fs');
const https = require('https');
const app = express();
// const {xml2js} = require('xml-js'); // This is used to convert the fetched data into JSON format. 
const xml2js = require('xml2js');
const bodyParser = require('body-parser');
const cors = require('cors')
const PORT = process.env.PORT || 3001;
const db = require('./db').client
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// first insert the data into the postgres.
app.get('/api/create', (req, res)=> {
    try {
        fetch("https://earthquake.usgs.gov/fdsnws/event/1/query?format=xml&minmagnitude=3&starttime=2024-01-01") // url with custom usage such as showing at most n entries
        .then(res=>res.text())
        .then(data=>{ xml2js.parseString(data, async (err, data) => { //convert to JSON for further process. 
            for (let item in data){
                for (let location of data[item]['eventParameters'][0]['event']){
                    if (location == undefined)
                        continue;
                    query = 'INSERT INTO earthquakes (Location, Mag, Lat, Long, Time) VALUES ($1, $2, $3, $4, $5)';
                    var name = location.description[0].text[0];
                    var mag = parseFloat(location.magnitude[0]?.mag[0].value[0]);
                    var long = parseFloat(location.origin[0]?.longitude[0].value[0]);
                    var lat = parseFloat(location.origin[0]?.latitude[0].value[0]);
                    var time = location.origin[0]?.time[0].value[0];
                    await db.query(query, [name, mag, lat, long, time]);
                }
            }
            console.log("Done updating!");
            res.status(200).send("Updating sucess!");
        })}) //Error handling. 
    } catch(err) {
        res.status(500).json({error: "Internal server error.", message: err})
    }
})

// Simple connection test for the sql database. 
app.get('/api/sql/connection_test', async (req, res)=>{
    try {
        db.query('SELECT 1', (err, result)=>{
            if (err){
                console.log("error: ", err);
                res.status(500).end("Internal server error.");
                return;
            }
            console.log("connected!");
            res.status(200).send("Sucess!");
        })
    } catch (error) {
        console.log("sql connect error.", error);
        res.status(500).end("Internal server error.");
    }
})

app.get('/api/test', (req, res)=> {
    // res.set('Content-Type', 'text/plain');
    console.log("test");
    res.status(200).json({succuess: "succeed."});
})

// =======================================================================================================
// Method 1: direct query
app.get('/api/eqs/:mag/:n/:date', (req, res)=> {
    // Handling client side request error. 
    if (req.params['mag'] === null || req.params['n'] === null || req.params['date']=== null){
        console.log("Cannot read request parameters!");
        res.status(400).json({message: "Request parameter(s) missing."})
    }
    fetch("https://earthquake.usgs.gov/fdsnws/event/1/query?format=xml&minmagnitude="
    +req.params['mag']+"&limit="+req.params['n']+"&starttime="+req.params['date']) // url with custom usage such as showing at most n entries
    // and earthquake at least with magnitude = mag.
    .then(res=>res.text())
    .then(data=>{ xml2js.parseString(data, (err, data) => { //convert to JSON for further process. 
        for (let item in data){
            // Finds the eventParameters object (there is only one), then send as response (in JSON).
            res.status(200).json({ message: "success", data: data[item]['eventParameters']});
        }

    })}) //Error handling. 
    .catch((err) => res.status(404).json({error: "Resource not found.", message: err}))
})


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

// const options = {
//     key: fs.readFileSync('cert/private.key'),
//     cert: fs.readFileSync('cert/certificate.crt')
// };

// https.createServer(options, app).listen(PORT, () => {
//     console.log('HTTPS server running on port '+PORT);
// });

// module.exports.handler = serverless(app)