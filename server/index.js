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
//     res.status(200).json({succuess: "yes, succeed."});
// })

app.get('/api/eqs/:mag/:n', (req, res)=> {
    fetch("https://earthquake.usgs.gov/fdsnws/event/1/query?format=xml&minmagnitude="
    +req.params['mag']+"&limit="+req.params['n']) // url with custom usage such as showing at most n entries
    // and earthquake at least with magnitude = mag.
    .then(res=>res.text())
    .then(data=>{ xml2js.parseString(data, (err, data) => { //convert to JSON for further process. 
        for (let item in data){
            // Finds the eventParameters object, then send as response (in JSON).
            res.json(data[item]['eventParameters']);
        }

    })}).catch(() => res.status(404).json({error: "info not found."}))
        // res.send(data1);

    })


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});