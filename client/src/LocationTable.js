import * as React from "react";
import {useState, useEffect} from 'react';
import {Box, Typography} from "@mui/material";
import {DataGrid} from '@mui/x-data-grid';
import LinearProgress from '@mui/material/LinearProgress';
import TextField from "@mui/material/TextField";

export default function LocationTable(props) {
    const [rows, setRows] = useState([{
        id: 1,
        location: "Updating information...",
        magnitude: 0,
        time: ""
    }]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [date, setDate] = useState("");
    const columns = [
        {
            field: "location",
            type: "string",
            hideable: false,
            flex: 1,
            renderHeader: (params) => (
                <strong>{"Location"}</strong>
            )
        },
        {
            field: "time",
            type: "string",
            hideable: false,
            width: 200,
            renderHeader: (params) => (
                <strong>{"Time"}</strong>
            )
        },
        {
            field: "magnitude",
            type: "number",
            hideable: false,
            width: 100,
            renderHeader: (params) => (
                <strong>{"Magnitude"}</strong>
            )
        },
    ];

    function createRow(id, location, mag, time) {
        return {id: id, location: location, magnitude: mag, time: time};
    }

    useEffect(() => {
        fetch('http://localhost:3001/api/eqs/5/50') // mag and limit are two numbers 
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                // Setting the row of the table.
                setRows([]); // React useEffect run twice under strict mode.
                for (let item of data[0].event) {
                    // console.log(item);
                    setRows((prevRows) => item.description[0].text[0].toLowerCase().includes(search.toLowerCase()) ? 
                    [...prevRows, createRow(item.origin[0].time[0].value[0], 
                        item.description[0].text[0], 
                        item.magnitude[0].mag[0].value[0],
                        item.origin[0].time[0].value[0].replace(/[TZ]/g, ', ').slice(0, -6) // Adjusting the time format into a readable format. 
                        )] : 
                    [...prevRows]);
                }
                var time_now = new Date();
                setDate(time_now.toLocaleString());
                setLoading(false);
            })
    }, [])

    return (
        <Box sx={{width: "100%"}}>

            <Box sx={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                <TextField id="input" className="text" onInput={() => setSearch(document.getElementById('input').value)}
                           label="Enter a location name" variant="outlined" placeholder="Search..." size="small"
                           sx={{flexGrow: 1, minWidth: 100, mr: 2}}/>
                <Typography sx={{flexGrow: 0}}> Last updated on: {date} </Typography>

            </Box>

            <DataGrid
                rows={rows}
                columns={columns}
                autoHeight
                disableColumnMenu
                pageSize={100}
                rowsPerPageOptions={[100]}
                components={{LoadingOverlay: LinearProgress,}}
                loading={loading}
                onRowClick={(data) => {console.log(data);}}
            />

        </Box>
    );
}