import {React, useState, useEffect} from 'react';
// import {GoogleMap, LoadScript, AdvancedMarker , InfoWindow} from '@react-google-maps/api';
import {APIProvider, Map, Marker, InfoWindow } from '@vis.gl/react-google-maps';


export default function MapContainer(props) {
    const [locations, setLocations] = useState([]);
    const [showing, setShowing] = useState();

    function createLocation(name, long, lat, time ) {
        return {name: name, long: long, lat: lat, time: time};
    }

    useEffect(() => {
        fetch('http://localhost:3001/api/eqs/5/50') // mag and limit are two numbers 
            .then((res) => res.json())
            .then((data) => {
                // console.log(data);
                // Setting the row of the table.
                setLocations([]); // React useEffect run twice under strict mode.
                for (let item of data[0].event) {
                    // console.log(item);
                    // console.log( item.origin[0].longitude[0].value[0]);
                    setLocations((prevRows) => 
                    [...prevRows, createLocation(
                        item.description[0].text[0], //name
                        item.origin[0].longitude[0].value[0], //long
                        item.origin[0].latitude[0].value[0], //lat
                        item.origin[0].time[0].value[0] //time, used for key 
                        )]);
                }
                // var time_now = new Date();
                // setDate(time_now.toLocaleString());
                // setLoading(false);
            })
    }, [])


    const mapStyles = {
        height: "100%",
        width: "100%"
    };

    const defaultCenter = {
        lat: 23.7, lng: 121
    }

    return (
        <APIProvider
        apiKey={"AIzaSyAbZ9dC0gMiRjip7f6SHMhgVZZK15JJJcc"}>
            <Map
                style={mapStyles}
                defaultZoom={2}
                defaultCenter={defaultCenter}>
                {locations.map((file, index) =>
                <>
                    {(showing == index) && ( // conditional rendering when clicked on particular mark, render accordingly. 

                    <InfoWindow position={{
                        lat: Number(locations[index].lat), 
                        lng:Number(locations[index].long)}}
                        onCloseClick={()=>setShowing()}    
                    >

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