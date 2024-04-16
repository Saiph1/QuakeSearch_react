const express = require("express");
const app = express();
// const {xml2js} = require('xml-js'); // This is used to convert the fetched data into JSON format. 
const xml2js = require('xml2js');
const bodyParser = require('body-parser');
const cors = require('cors')
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
const PORT = 3001;

// app.get('/api/test', (req, res)=> {
//     // res.set('Content-Type', 'text/plain');
//     console.log("test");
//     res.status(200).json({succuess: "succeed."});
// })

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
// =======================================================================================================
// Method 2: filtering, too slow. Not realistic. 
app.get('/api/eqs2/:mag/:n/:date', (req, res)=> {

    let mag = parseFloat(req.params['mag']);
    let maximum = parseInt(req.params['n']); 
    let date = req.params['date'];

    // Handling client side request error. 
    if (mag === null || maximum === null || date === null){
        console.log("Cannot read request parameters!");
        res.status(400).json({message: "Request parameter(s) missing."})
    }

    fetch("https://earthquake.usgs.gov/fdsnws/event/1/query?format=xml&limit=1000&starttime="+date) // url with custom usage such as showing at most n entries
    // and earthquake at least with magnitude = mag.
    .then(res=>res.text())
    .then(data=>{ xml2js.parseString(data, (err, data) => { //convert to JSON for further process. 
        let result = []; 
        for (let item in data){
            for (let location of data[item]['eventParameters'][0]['event']){
                if (parseFloat(location.magnitude[0].mag[0].value[0]) > mag)
                    result.push(location);
                // // // return at most maximum locations. 
                if (result.length >= maximum)
                    break; 
            }
        }
        res.status(200).json({ message: "success", data: [{event: result}]});
        // res.status(200).json({ message: "success", data: data[item]['eventParameters']});

    })}) //Error handling. 
    .catch((err) => res.status(404).json({error: "Resource not found.", message: err}))
})


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});