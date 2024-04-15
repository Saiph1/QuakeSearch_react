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
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

import dayjs from 'dayjs';

function App() {
  const [mag, setMag] = useState(5);
  const [limit, setLimit] = useState(200);
  const [date, setDate] = useState(dayjs( '2024-01-01'));
  const [tableclicked, setTableclicked] = useState("");
  const [data, setData] = useState();
  const [submit, setSubmit] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [displaySuccessMessage, setDisplaySuccessMessage] = useState(0);
  const [incorrectDate, setIncorrectDate] = useState(false);

  // fetch new data, then pass to the child components. 
  useEffect(() => {
    fetch('http://localhost:3001/api/eqs/'+mag+'/'+limit+'/'+date.format('YYYY-MM-DD')) // fetch according to the selection options. 
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);
          setData(data.data[0].event);
        })
    // Cooldown for the submit button to avoid too many query in a short amount of time. 
    const countdown = setInterval(() => {
        setCooldown((prevCount)=>{
          if (prevCount <=0 ){
            clearInterval(countdown);
            setDisplaySuccessMessage(0);
            return prevCount; 
          }
          else return prevCount-1;
        });
    }, 1000);
    
  }, [submit]); // Fetch new data when these three states update. 

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
                          value={date}
                          onChange={(newValue) => {
                            setDate(newValue); 
                            setIncorrectDate(!newValue.isBefore(dayjs( new Date().toLocaleString()))); // check whther the input date is before "today".
                          }}/>
                      </LocalizationProvider>
                        <FormControl sx={{width: "20%", marginLeft: 1}}>
                          <InputLabel>Magnitude</InputLabel>
                          <Select
                            labelId="select_magnitude"
                            id="select_magnitude"
                            value={mag}
                            label="Magnitude"
                            onChange={(event)=>{setMag(event.target.value)}}
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
                        <InputLabel>Maximum results</InputLabel>
                        <Select
                          labelId="select_results"
                          id="select_results"
                          // defaultValue={0}
                          value={limit}
                          label="Magnitude"
                          onChange={(event)=>{setLimit(event.target.value)}}
                        >
                          <MenuItem value={20}>Less than 20</MenuItem>
                          <MenuItem value={50}>Less than 50</MenuItem>
                          <MenuItem value={100}>Less than 100</MenuItem>
                          <MenuItem value={200}>Less than 200</MenuItem>
                          <MenuItem value={300}>Less than 300</MenuItem>
                        </Select>
                        </FormControl>
                        <Button variant="contained" 
                          sx={{marginLeft: 1}} 
                          disabled={cooldown>0 || incorrectDate} 
                          onClick={()=>{
                            setSubmit(!submit); 
                            setDisplaySuccessMessage(5);
                            setCooldown(5);
                          }}> 
                          Submit
                        </Button>
                        
                    </Box>
                    {displaySuccessMessage >0? (<Alert severity="success" sx={{marginBottom: 1}}>Your request has been submitted.</Alert>):(<></>)}
                    {incorrectDate >0? (<Alert severity="error" sx={{marginBottom: 1}}>Please check your input date!</Alert>):(<></>)}
                    <LocationTable data={data} loctime={setTableclicked}/>
                </Grid>

            </Grid>
        </Container>
      </main>
    </div>
  );
}

export default App;
