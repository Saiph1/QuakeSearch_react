import './App.css';
import {React, useState, useEffect} from 'react';
import {Container} from "@mui/material";
import Box  from "@mui/material/Box";
import Grid from '@mui/material/Unstable_Grid2';
import MapContainer from "./MapContainer";
import LocationTable from './LocationTable';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import dayjs from 'dayjs';

function App() {
  const [mag, setMag] = useState(5);
  const [limit, setLimit] = useState(200);
  const [date, setDate] = useState();
  const [tableclicked, setTableclicked] = useState("");
  const [data, setData] = useState();

  // fetch new data, then pass to the child components. 
  useEffect(() => {
    fetch('http://localhost:3001/api/eqs/'+mag+'/'+limit) // fetch according to the selection options. 
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setData(data[0].event);
        })
    
  }, [mag, limit, date]); // Fetch new data when these three states update. 



  return (
    <div className="App">
      <main>
        <Container maxWidth="xl" sx={{mt: 2}}>
            <Grid container spacing={2}>
                <Grid key="map" lg={4} xs={12}>
                    <Box sx={{height: 400}}>
                        <MapContainer data={data} findlocbyitstime={tableclicked}/>
                    </Box>
                </Grid>
                <Grid key="table&date" lg={8} xs={12}>
                    <Box sx={{display: "flex", alignItems: "left", justifyContent: "left", width: "100%", marginBottom: 1}}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Starting date"
                          // value={date}
                          onChange={(newValue) => {setDate(newValue.$d); console.log(newValue); console.log(date)}}
                          />
                      </LocalizationProvider>
                        <FormControl sx={{width: "20%", marginLeft: 1}}>
                          <InputLabel>Magnitude</InputLabel>
                          <Select
                            labelId="select_magnitude"
                            id="select_magnitude"
                            value={mag}
                            label="Magnitude"
                            onChange={(event)=>{setMag(event.target.value); console.log(event.target.value)}}
                          >
                            <MenuItem value={1}>1 or above</MenuItem>
                            <MenuItem value={2}>2 or above</MenuItem>
                            <MenuItem value={3}>3 or above</MenuItem>
                            <MenuItem value={4}>4 or above</MenuItem>
                            <MenuItem value={5}>5 or above</MenuItem>
                            <MenuItem value={6}>6 or above</MenuItem>
                            <MenuItem value={7}>7 or above</MenuItem>
                            <MenuItem value={8}>8 or above</MenuItem>
                          </Select>
                        </FormControl>
                        <FormControl sx={{width: "20%", marginLeft: 1}}>
                        <InputLabel>No. of results</InputLabel>
                        <Select
                          labelId="select_magnitude"
                          id="select_magnitude"
                          // defaultValue={0}
                          value={limit}
                          label="Magnitude"
                          onChange={(event)=>{setLimit(event.target.value); console.log(event.target.value)}}
                        >
                          <MenuItem value={20}>20 or more</MenuItem>
                          <MenuItem value={50}>50 or more</MenuItem>
                          <MenuItem value={100}>100 or more</MenuItem>
                          <MenuItem value={200}>200 or more</MenuItem>
                          <MenuItem value={300}>300 or more</MenuItem>
                        </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{display: "flex", alignItems: "left", justifyContent: "left", width: "100%", marginBottom: 1}}>
                      
                    </Box>
                    <LocationTable data={data} date={date} loctime={setTableclicked}/>
                </Grid>

            </Grid>
        </Container>
      </main>
    </div>
  );
}

export default App;
