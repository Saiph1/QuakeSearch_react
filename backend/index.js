const express = require("express");
const fs = require("fs");
const https = require("https");
const app = express();
// const {xml2js} = require('xml-js'); // This is used to convert the fetched data into JSON format.
const xml2js = require("xml2js");
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = process.env.PORT || 3001;
const db = require("./db").client;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// =======================================================================================================
// Method 1: PosgreSQL queries

// This should not be accessible from public.
// Create table for the earthquakes data
// app.get('/api/create', async (req, res)=>{
//     try {
//         let create_text = `CREATE TABLE earthquakes
//             (id SERIAL PRIMARY KEY ,
//             Location VARCHAR(255) NOT NULL,
//             Mag FLOAT NOT NULL,
//             Lat FLOAT NOT NULL,
//             Long FLOAT NOT NULL,
//             Time VARCHAR(255)
//         );`

//         db.query(create_text, (err, result)=>{
//             if (err){
//                 console.log("error: ", err);
//                 res.status(500).end("Internal server error.");
//                 return;
//             }
//             console.log("Create table Earthquakes success!");
//             res.status(200).send("Success!");
//         })
//     } catch (error) {
//         console.log("sql connect error.", error);
//         res.status(500).end("Internal server error.");
//     }
// })

// This should not be accessible from public.
// first insert the data into the postgres.
// app.get('/api/insert', (req, res)=> {
//     try {
//         fetch("https://earthquake.usgs.gov/fdsnws/event/1/query?format=xml&minmagnitude=3&starttime=2024-01-01") // url with custom usage such as showing at most n entries
//         .then(res=>res.text())
//         .then(data=>{ xml2js.parseString(data, async (err, data) => { //convert to JSON for further process.
//             var total_counts = 0;
//             for (let item in data){
//                 for (let location of data[item]['eventParameters'][0]['event']){
//                     if (location == undefined)
//                         continue;
//                     total_counts+=1;
//                     query = 'INSERT INTO earthquakes (Location, Mag, Lat, Long, Time) VALUES ($1, $2, $3, $4, $5)';
//                     var name = location.description[0].text[0];
//                     var mag = parseFloat(location.magnitude[0]?.mag[0].value[0]);
//                     var long = parseFloat(location.origin[0]?.longitude[0].value[0]);
//                     var lat = parseFloat(location.origin[0]?.latitude[0].value[0]);
//                     var time = location.origin[0]?.time[0].value[0];
//                     await db.query(query, [name, mag, lat, long, time]);
//                 }
//             }
//             console.log("Done insertion!");
//             console.log("Total entries: ",total_counts);
//             res.status(200).send("Updating success!");
//         })}) //Error handling.
//     } catch(err) {
//         res.status(500).json({error: "Internal server error.", message: err})
//     }
// })

// Simple connection test for the sql database.
app.get("/api/sql/connection_test", async (req, res) => {
  try {
    db.query("SELECT 1", (err, result) => {
      if (err) {
        console.log("error: ", err);
        res.status(500).end("Internal server error.");
        return;
      }
      console.log("connected!");
      res.status(200).send("Success!");
    });
  } catch (error) {
    console.log("sql connect error.", error);
    res.status(500).end("Internal server error.");
  }
});

// api get data for map
app.get("/api/get_eqs/:LIMIT", async (req, res) => {
  try {
    let create_text = `SELECT * FROM earthquakes `;
    if (req.query) {
      create_text += "WHERE 1=1";
      for (let item in req.query) {
        if (req.query[item] != "")
          create_text += " AND " + item + " > " + req.query[item];
      }
    }
    create_text += " LIMIT " + req.params["LIMIT"] + ";"; //Limit needs to be supplied from frontend all the time. (req.params cannot be empty or else api will not receive req)
    console.log(create_text);
    db.query(create_text, async (err, result) => {
      if (err) {
        console.log("error: ", err);
        res.status(500).end("Internal server error.");
        return;
      }
      // console.log("Get earthquakes data success!");
      db.query("SELECT MAX(time) AS time FROM lastupdate;", (err2, result2) => {
        if (err) {
          console.log("error: ", err);
          res.status(500).end("Internal server error.");
          return;
        }
        // console.log("Get time data success!");
        res
          .status(200)
          .send({
            Message: "Success.",
            data: [{ event: result.rows }],
            time: result2.rows,
          });
      });
    });
  } catch (error) {
    console.log("sql connect error.", error);
    res.status(500).end("Internal server error.");
  }
});

// =======================================================================================================
// Data for analytics:
// Recent Earthquakes
app.get("/api/analytics/recent", async (req, res) => {
  try {

    let query_text = `
      SELECT * FROM earthquakes
      ORDER BY time DESC 
      LIMIT 10;
    `;
    db.query(query_text, async (err, result) => {
      if (err) {
        console.log("error: ", err);
        res.status(500).end("Internal server error.");
        return;
      }
      // console.log("Get earthquakes data success!");
      // console.log(result.rows);
      res.status(200).send({
            Message: "Success.",
            data: result.rows,
          });
    });
  } catch (error) {
    console.log("sql connect error.", error);
    res.status(500).end("Internal server error.");
  }
});

// Earthquake past x days.
app.get("/api/analytics/linechart/:date", async (req, res) => {
  try {

    let query_text = `
      SELECT x, COUNT(*) AS y
      FROM (
        SELECT mag, SUBSTRING(time, 6, 5) AS x
        FROM earthquakes
      )
      GROUP BY x
      HAVING x > '`+req.params['date']+
      `' ORDER BY x ASC;`;
    db.query(query_text, async (err, result) => {
      if (err) {
        console.log("error: ", err);
        res.status(500).end("Internal server error.");
        return;
      }
      // console.log("Get earthquakes data success!");
      // console.log(result.rows);
      db.query("SELECT COUNT(*) FROM earthquakes WHERE mag >= 5 AND time >= '" +req.params['date']+ "' ;", (err, result2) => {
        res.status(200).send({
              Message: "Success.",
              data: result.rows,
              mag: result2.rows,
          });
      });
    
    })
  } catch (error) {
    console.log("sql connect error.", error);
    res.status(500).end("Internal server error.");
  }
});

// Magnitudes distribution
app.get("/api/analytics/distribution/:date", async (req, res) => {
  try {
    let query_text = `
      SELECT x AS Date, 
      SUM(CASE WHEN mag >= 3 AND mag < 3.5 THEN 1 ELSE 0 END) AS "3 ~ 3.5", 
      SUM(CASE WHEN mag >= 3.5 AND mag < 4 THEN 1 ELSE 0 END) AS "3.5 ~ 4", 
      SUM(CASE WHEN mag >= 4 AND mag < 4.5 THEN 1 ELSE 0 END) AS "4 ~ 4.5", 
      SUM(CASE WHEN mag >= 4.5 AND mag < 5 THEN 1 ELSE 0 END) AS "4.5 ~ 5", 
      SUM(CASE WHEN mag >= 5 THEN 1 ELSE 0 END) AS "> 5"
      FROM (
        SELECT mag, SUBSTRING(time, 6, 5) AS x
        FROM earthquakes
      )
      GROUP BY x
      HAVING x > '`+req.params['date']+`' ORDER BY x ASC;`;
    db.query(query_text, async (err, result) => {
      if (err) {
        console.log("error: ", err);
        res.status(500).end("Internal server error.");
        return;
      }
      // console.log("Get earthquakes data success!");
      // console.log(result.rows);
      res.status(200).send({
            Message: "Success.",
            data: result.rows,
        });
    })
  } catch (error) {
    console.log("sql connect error.", error);
    res.status(500).end("Internal server error.");
  }
});

// Yesterday % data: 
app.get("/api/analytics/yesterday/:prev", async (req, res) => {
  try {
    let query_text = `
      SELECT x AS Date, COUNT(*) AS total
      FROM (
        SELECT SUBSTRING(time, 6, 5) AS x
        FROM earthquakes
      )
      GROUP BY x
      HAVING x >= '`+req.params['prev']+`' ORDER BY x ASC;`;
      // console.log(query_text);
    db.query(query_text, async (err, result) => {
      if (err) {
        console.log("error: ", err);
        res.status(500).end("Internal server error.");
        return;
      }
      // console.log("Get earthquakes data success!");
      // console.log(result.rows);
      res.status(200).send({
            Message: "Success.",
            data: result.rows,
        });
    })
  } catch (error) {
    console.log("sql connect error.", error);
    res.status(500).end("Internal server error.");
  }
});

// Getting geo data for the map in analytics.
const geo = fs.readFileSync('./Geo.sql', 'utf8');
app.get("/api/analytics/geo", async (req, res) => {
  try {
    db.query(geo, async (err, result) => {
      if (err) {
        console.log("error: ", err);
        res.status(500).end("Internal server error.");
        return;
      }
      res.status(200).send({
            Message: "Success.",
            data: result.rows,
        });
    })
  } catch (error) {
    console.log("sql connect error.", error);
    res.status(500).end("Internal server error.");
  }
});
// =======================================================================================================
// Method 2: direct query
// app.get("/api/eqs/:mag/:n/:date", (req, res) => {
//   // Handling client side request error.
//   if (
//     req.params["mag"] === null ||
//     req.params["n"] === null ||
//     req.params["date"] === null
//   ) {
//     console.log("Cannot read request parameters!");
//     res.status(400).json({ message: "Request parameter(s) missing." });
//   }
//   fetch(
//     "https://earthquake.usgs.gov/fdsnws/event/1/query?format=xml&minmagnitude=" +
//       req.params["mag"] +
//       "&limit=" +
//       req.params["n"] +
//       "&starttime=" +
//       req.params["date"],
//   ) // url with custom usage such as showing at most n entries
//     // and earthquake at least with magnitude = mag.
//     .then((res) => res.text())
//     .then((data) => {
//       xml2js.parseString(data, (err, data) => {
//         //convert to JSON for further process.
//         for (let item in data) {
//           // Finds the eventParameters object (there is only one), then send as response (in JSON).
//           res
//             .status(200)
//             .json({ message: "success", data: data[item]["eventParameters"] });
//         }
//       });
//     }) //Error handling.
//     .catch((err) =>
//       res.status(404).json({ error: "Resource not found.", message: err }),
//     );
// });

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
