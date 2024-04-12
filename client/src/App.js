import './App.css';
import {Container} from "@mui/material";
import Box  from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from '@mui/material/Unstable_Grid2';
import MapContainer from "./MapContainer";
import LocationTable from './LocationTable';

function App() {
  return (
    
    <div className="App">
      <main>
        <Container maxWidth="xl" sx={{mt: 2}}>
            <Grid container spacing={2}>

                <Grid key="map" lg={4} xs={12}>
                    <Box sx={{height: 400}}>
                        <MapContainer/>
                    </Box>
                </Grid>

                <Grid key="table" lg={8} xs={12}>
                    <LocationTable/>
                </Grid>

            </Grid>
        </Container>
      </main>
    </div>
  );
}

export default App;
