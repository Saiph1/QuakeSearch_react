import { React, useState, useEffect } from "react";
// import {GoogleMap, LoadScript, AdvancedMarker , InfoWindow} from '@react-google-maps/api';
import {
  APIProvider,
  Map,
  Marker,
  InfoWindow,
} from "@vis.gl/react-google-maps";

export default function MapContainer(props) {
  const [locations, setLocations] = useState([]);
  const [showing, setShowing] = useState();
  const [tableshow, setTableshow] = useState(props.findlocbyitstime);

  function createLocation(name, long, lat, time, mag) {
    return { name: name, long: long, lat: lat, time: time, mag: mag };
  }

  useEffect(() => {
    setTableshow(props.findlocbyitstime);
    setShowing();
  }, [props.findlocbyitstime]);

  // when first load, or the parent passes different props.data
  useEffect(() => {
    setLocations([]); // React useEffect run twice under strict mode.
    // console.log(props.data)
    if (props.data === undefined) return;
    for (let item of props.data) {
      setLocations((prevRows) =>
        // Method 1: Direct Query:
        // [...prevRows, createLocation(
        //     item.description[0].text[0], //name
        //     item.origin[0].longitude[0].value[0], //long
        //     item.origin[0].latitude[0].value[0], //lat
        //     item.origin[0].time[0].value[0].replace(/[TZ]/g, ', ').slice(0, -6), //time, used for key
        //     parseFloat(item.magnitude[0].mag[0].value[0]).toFixed(1),// magnitude used in a display window.

        // )]);

        // Method 2: PostgreSQL Query:
        [
          ...prevRows,
          createLocation(
            item.location, //name
            item.long, //long
            item.lat, //lat
            // item.time.replace(/[TZ]/g, ', ').slice(0, -6), //time, used for key
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
            parseFloat(item.mag).toFixed(1), // magnitude used in a display window.
          ),
        ],
      );
    }
  }, [props.data]);

  const mapStyles = {
    height: "100%",
    width: "100%",
  };

  return (
    <APIProvider apiKey={"AIzaSyAbZ9dC0gMiRjip7f6SHMhgVZZK15JJJcc"}>
      <Map
        style={mapStyles}
        defaultZoom={2}
        defaultCenter={{ lat: 23.7, lng: 121 }}
      >
        {locations.map((file, index) => (
          <div key={locations[index] + index}>
            {(showing === index || tableshow === locations[index].time) && ( // conditional rendering when clicked on a particular mark, render accordingly.
              <InfoWindow
                key={locations[index]}
                position={{
                  lat: Number(locations[index].lat),
                  lng: Number(locations[index].long),
                }}
                onCloseClick={() => setShowing()}
              >
                Magnitude:&nbsp;
                {locations[index].mag}
                <br></br>
                {locations[index].name}
              </InfoWindow>
            )}

            <Marker
              key={index}
              onClick={() => {
                setShowing(index);
                setTableshow();
              }}
              position={{
                lat: Number(locations[index].lat),
                lng: Number(locations[index].long),
              }}
            ></Marker>
          </div>
        ))}
      </Map>
    </APIProvider>
  );
}
