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
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';


import dayjs from 'dayjs';

function App() {
  const [mag, setMag] = useState("");
  const [limit, setLimit] = useState(20);
  const [date, setDate] = useState(dayjs( '2024-01-01'));
  const [tableclicked, setTableclicked] = useState("");
  const [data, setData] = useState();
  const [submit, setSubmit] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [displaySuccessMessage, setDisplaySuccessMessage] = useState(0);
  const [incorrectDate, setIncorrectDate] = useState(false);
  const [open, setOpen] = useState(true);
  const [db_time, setDb_time] = useState();

  // fetch new data, then pass to the child components. 
  useEffect(() => {
    // fetch('https://lchsuan.life:3001/api/eqs/'+mag+'/'+limit+'/'+date.format('YYYY-MM-DD'))
    fetch('https://lchsuan.life:3001/api/get_eqs/'+limit+'?mag='+mag+"&time='"+date.format('YYYY-MM-DD')+"'")
    // fetch('http://localhost:3001/api/eqs/'+mag+'/'+limit+'/'+date.format('YYYY-MM-DD')) // fetch according to the selection options. 
        .then((res) => res.json())
        .then((data) => {
          // console.log("http success", data);
          setDb_time(data.time[0].time)
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

  const action = (
    <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={()=>setOpen(false)}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
  )
  return (
    <div className="App">
      <main>
        <Snackbar
          open={open}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          autoHideDuration={5000}
          onClose={()=>setOpen(false)}
          message="Please note that the current database only supports data after 2024-01-01."
          action={action}
        />
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
                            setIncorrectDate(!newValue.isBefore(dayjs( new Date()))); // check whther the input date is before "today".
                            // This will solve the issue as Date.toLocaleString() would result in dayjs invalid date format. 
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
                            <MenuItem value={""}>None</MenuItem>
                            <MenuItem value={3}>3 or above</MenuItem>
                            <MenuItem value={4}>4 or above</MenuItem>
                            <MenuItem value={5}>5 or above</MenuItem>
                            <MenuItem value={6}>6 or above</MenuItem>
                            <MenuItem value={7}>7 or above</MenuItem>
                          </Select>
                        </FormControl>
                        <FormControl sx={{width: "15%", marginLeft: 1}}>
                        <InputLabel>Max. results</InputLabel>
                        <Select
                          labelId="select_results"
                          id="select_results"
                          // defaultValue={0}
                          value={limit}
                          label="Magnitude"
                          onChange={(event)=>{setLimit(event.target.value)}}
                        >
                          <MenuItem value={20}>20</MenuItem>
                          <MenuItem value={50}>50</MenuItem>
                          <MenuItem value={100}>100</MenuItem>
                          <MenuItem value={200}>200</MenuItem>
                          <MenuItem value={300}>300</MenuItem>
                          <MenuItem value={500}>500</MenuItem>
                          <MenuItem value={1000}>1000</MenuItem>
                          <MenuItem value={2000}>2000</MenuItem>
                          <MenuItem value={3000}>3000</MenuItem>
                          <MenuItem value={10000}> All data</MenuItem>
                        </Select>
                        </FormControl>
                        <Button variant="contained" 
                          sx={{marginLeft: 1}} 
                          disabled={cooldown>0 || incorrectDate} 
                          onClick={()=>{
                            setSubmit(!submit); 
                            setDisplaySuccessMessage(5);
                            setTableclicked("");
                            setCooldown(5);
                          }}> 
                          Submit
                        </Button>
                    </Box>
                    {displaySuccessMessage >0? (<Alert severity="success" sx={{marginBottom: 1}}>Your request has been submitted.</Alert>):(<></>)}
                    {incorrectDate >0? (<Alert severity="error" sx={{marginBottom: 1}}>Please check your input date!</Alert>):(<></>)}
                    <LocationTable data={data} loctime={setTableclicked} time_db={db_time}/>
                </Grid>
            </Grid>
        </Container>
      </main>
    </div>
  );
}

export default App;
