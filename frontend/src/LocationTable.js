import * as React from "react";
import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import LinearProgress from "@mui/material/LinearProgress";
import TextField from "@mui/material/TextField";

export default function LocationTable(props) {
  const [rows, setRows] = useState([
    {
      id: 1,
      location: "Updating information...",
      magnitude: 0,
      time: "",
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const columns = [
    {
      field: "location",
      type: "string",
      hideable: false,
      flex: 1,
      renderHeader: (params) => <strong>{"Location"}</strong>,
    },
    {
      field: "time",
      type: "string",
      hideable: true,
      width: 200,
      renderHeader: (params) => <strong>{"Time (UTC+8)"}</strong>,
    },
    {
      field: "magnitude",
      type: "number",
      hideable: false,
      width: 100,
      renderHeader: (params) => <strong>{"Magnitude"}</strong>,
    },
  ];

  function createRow(id, location, mag, time, lat, long) {
    return {
      id: id,
      location: location,
      magnitude: mag,
      time: time,
      lat: lat,
      long: long,
    };
  }
  // when first load, or the parent passes different props.data
  useEffect(() => {
    setRows([]); // React useEffect run twice under strict mode.]
    if (props.data === undefined) return;
    for (let item of props.data) {
      // console.log(item);
      setRows((prevRows) =>
        // Method1: Direct query:
        // [...prevRows, createRow(item.origin[0].time[0].value[0],
        //     item.description[0].text[0],
        //     parseFloat(item.magnitude[0].mag[0].value[0]).toFixed(1), //magnitude, but in a consistent format (1 decimal place.)
        //     item.origin[0].time[0].value[0].replace(/[TZ]/g, ', ').slice(0, -6), // Adjusting the time data into a readable format.
        //     // replacing 'T' 'Z' with ', '.
        //     // remove the last four elements of the array, the miliseconds.
        //     item.origin[0].latitude[0].value[0], //lat, passing this to the parent -> map center
        //     item.origin[0].longitude[0].value[0], //long, passing this to the parent -> map center
        // )]

        // Method2: PostgreSQL query:
        [
          ...prevRows,
          createRow(
            item.time,
            item.location, //name
            parseFloat(item.mag).toFixed(1), //magnitude, but in a consistent format (1 decimal place.)
            new Date(item.time).toLocaleString("en-US", {
              timeZone: "Asia/Singapore",
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
            // item.time.replace(/[TZ]/g, ', ').slice(0, -6), // Adjusting the time data into a readable format.
            // replacing 'T' 'Z' with ', '.
            // remove the last four elements of the array, the miliseconds.
            item.lat, //lat, passing this to the parent -> map center
            item.long, //long, passing this to the parent -> map center
          ),
        ],
      );
    }
    var time_now = new Date();
    // setDate(time_now.toLocaleString());
    setDate(props.time_db);
    setLoading(false);
    // console.log(rows);
  }, [props.data]);

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 1,
        }}
      >
        <TextField
          id="input"
          className="text"
          onInput={() => setSearch(document.getElementById("input").value)}
          label="Enter a location name"
          variant="outlined"
          placeholder="Search..."
          size="small"
          sx={{ flexGrow: 1, minWidth: 100, mr: 2 }}
        />
        <Typography sx={{ flexGrow: 0 }}>
          {" "}
          Last updated on: {date} (UTC+8)
        </Typography>
      </Box>

      <DataGrid
        rows={rows.filter((item) =>
          item.location.toLowerCase().includes(search.toLowerCase()),
        )} // FIlter for the search box.
        columns={columns}
        autoHeight
        disableColumnMenu
        pageSize={100}
        onRowClick={(data) => {
          props.loctime(data.row.time);
        }} // temporary disable moving the map center. (which cause the map to freeze)
        // onRowClick={(data)=>{props.movemap({lat: Number(data.row.lat), lng: Number(data.row.long)}); props.loctime(data.row.time)}}
        rowsPerPageOptions={[100]}
        components={{ LoadingOverlay: LinearProgress }}
        loading={loading}
      />
    </Box>
  );
}
