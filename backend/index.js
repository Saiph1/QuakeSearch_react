const express = require("express");
const fs = require('fs');
const https = require('https');
const app = express();
// const {xml2js} = require('xml-js'); // This is used to convert the fetched data into JSON format. 
const xml2js = require('xml2js');
const bodyParser = require('body-parser');
const cors = require('cors')
const PORT = process.env.PORT || 3001;
const db = require('./db')
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Connect to the database
// client.connect((err) => {
//     if (err) {
//       console.error('Error connecting to database:', err);
//       return;
//     }
//     console.log('Connected to PostgreSQL database!');
  
//     // Example query
//     client.query('SELECT * FROM users', (err, res) => {
//       if (err) {
//         console.error('Error executing query:', err);
//         return;
//       }
//       console.log('Query result:', res.rows);
//       client.end(); // Close the connection
//     });
// });

app.get('/api/sql/connection_test', async (req, res)=>{
    try {
        const result = await db.connect();
        res.json(result);
    } catch (error) {
        console.log("sql query error.");
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