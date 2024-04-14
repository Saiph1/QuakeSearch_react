import {React, useState, useEffect} from 'react';
// import {GoogleMap, LoadScript, AdvancedMarker , InfoWindow} from '@react-google-maps/api';
import {APIProvider, Map, Marker, InfoWindow } from '@vis.gl/react-google-maps';


export default function MapContainer(props) {
    const [locations, setLocations] = useState([]);
    const [showing, setShowing] = useState();
    const [tableshow, setTableshow] = useState(props.findlocbyitstime);
    const [center_now, setCenter_now] = useState();

    function createLocation(name, long, lat, time, mag ) {
        return {name: name, long: long, lat: lat, time: time, mag: mag};
    }

    useEffect(() => {
        setCenter_now(props.center);
    }, [props.center])

    useEffect(() => {
        setTableshow(props.findlocbyitstime);
    }, [props.findlocbyitstime])

    useEffect(() => {
        fetch('http://localhost:3001/api/eqs/'+props.lowestmag+'/'+props.eqlimit) // passed from the parent (app)
            .then((res) => res.json())
            .then((data) => {
                // console.log(data);
                // Setting the row of the table.
                setLocations([]); // React useEffect run twice under strict mode.
                for (let item of data[0].event) {
                    // console.log( item.origin[0].longitude[0].value[0]);
                    setLocations((prevRows) => 
                    [...prevRows, createLocation(
                        item.description[0].text[0], //name
                        item.origin[0].longitude[0].value[0], //long
                        item.origin[0].latitude[0].value[0], //lat
                        item.origin[0].time[0].value[0].replace(/[TZ]/g, ', ').slice(0, -6), //time, used for key 
                        item.magnitude[0].mag[0].value[0], // magnitude used in a display window.

                    )]);
                }
            })
    }, [])


    const mapStyles = {
        height: "100%",
        width: "100%"
    };

    return (
        <APIProvider
        apiKey={"AIzaSyAbZ9dC0gMiRjip7f6SHMhgVZZK15JJJcc"}>
            
            <Map
                style={mapStyles}
                defaultZoom={2}
                defaultCenter={{lat: 23.7, lng: 121}}
                // center={{lat: center_now?.lat, lng: center_now?.lng}}
            >
                {locations.map((file, index) =>
                <>
                    {((showing == index)||(tableshow == locations[index].time)) && ( // conditional rendering when clicked on particular mark, render accordingly. 

                    <InfoWindow key={locations[index].time}
                        position={{
                        lat: Number(locations[index].lat), 
                        lng:Number(locations[index].long)}}
                        onCloseClick={()=>setShowing()}    
                    >

                        Magnitude:&nbsp;
                        {locations[index].mag}<br></br>
                        {locations[index].name} 

                    </InfoWindow>)}

                    <Marker key={index}
                        onClick={()=>setShowing(index)}
                        position={{lat: Number(locations[index].lat), lng: Number(locations[index].long)}}>
                                
                    </Marker >
                </>
                    )}
                    
            </Map>
        </APIProvider>
    )
}