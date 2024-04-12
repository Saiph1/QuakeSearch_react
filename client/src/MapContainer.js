import {React, useState, useEffect} from 'react';
import {GoogleMap, LoadScript, Marker} from '@react-google-maps/api';

export default function MapContainer(props) {
    const [locations, setLocations] = useState([]);

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
                    console.log(item);
                    console.log( item.origin[0].longitude[0].value[0]);
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
        lat: 0, lng: 0
    }

    const handlelocation = (id, e) => {
        e.preventDefault();
        console.log("debug purpose");
    }

    return (
        <LoadScript
            googleMapsApiKey='AIzaSyAbZ9dC0gMiRjip7f6SHMhgVZZK15JJJcc'>
            <GoogleMap
                mapContainerStyle={mapStyles}
                zoom={13}
                center={defaultCenter}>
                {locations.map((file, index) =>
                    <Marker key={locations[index].time}
                            onClick={console.log("clicked")}
                            position={{lat: Number(locations[index].lat), lng: Number(locations[index].long)}}>
                    </Marker>)}
            </GoogleMap>

        </LoadScript>
    )
}