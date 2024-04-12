import {React, useState, useEffect} from 'react';
import {GoogleMap, LoadScript, Marker} from '@react-google-maps/api';

export default function MapContainer(props) {
    const [loc, setLoc] = useState([]);

    // useEffect(()=>{
    //   fetch('/api/location')
    //   .then((res) => res.json())
    //   .then((data) => {
    //     const jsData = JSON.parse(data);
    //     setLoc([]);
    //     for (let item in jsData) {
    //       setLoc((prev) => ((jsData[item].lat == undefined)||([...prev].findIndex((ele)=>ele.lat == jsData[item].lat)+1))? [...prev]: [...prev, {lat: Number(jsData[item].lat), long: Number(jsData[item].long)}]);
    //     }
    // })
    // }, []) 

    useEffect(() => {
        fetch('/api/location_client')
            .then((res) => res.json())
            .then((data) => {
                // console.log(data);
                setLoc([]);
                for (let item of data) {
                    setLoc((prevloc) => ([...prevloc].findIndex((ele) => ele.lat == item.locLat) + 1) ? [...prevloc] : [...prevloc, {
                        lat: item.locLat,
                        long: item.locLong,
                        venueid: item.venueid
                    }]);
                }
            })
    }, [])


    const mapStyles = {
        height: "100%",
        width: "100%"
    };

    const defaultCenter = {
        lat: 22.285056, lng: 114.222075
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
                {loc.map((file, index) =>
                    <Marker key={loc[index].venueid}
                            onClick={handlelocation.bind(this, loc[index].venueid)}
                            position={{lat: loc[index].lat, lng: loc[index].long}}>
                    </Marker>)}
            </GoogleMap>

        </LoadScript>
    )
}