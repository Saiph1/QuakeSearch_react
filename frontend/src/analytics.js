import { React, useState, useEffect } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "./components/theme";
import StatBox from "./components/StatBox"
import LineChart from "./components/Linechart"
import GeographyChart from "./components/GeographyChart";
import BarChart from "./components/barchart";
import TodayIcon from '@material-ui/icons/Today';
import Looks5Icon from '@material-ui/icons/Looks5';
import TimelineIcon from '@material-ui/icons/Timeline';
import { useMediaQuery } from '@material-ui/core';

export default function Analytics(props) {
    const isPhoneScreen = useMediaQuery('(max-width:800px)');
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [total_14, setTotal_14] = useState(0); // total amount of earthquake in the past 14 days.
    const [total_7, setTotal_7] = useState(0); // total amount of earthquake in the past 7 days.
    const [yesterday, setyesterday] = useState(0);
    const [recent_eq, setRecent_eq] = useState([]); // earthquake data
    const [eq_chart, setEq_chart] = useState([]);
    const [bardata, setBardata] = useState([]);
    const [mag5, setMag5] = useState([]); // Amount of earthquake having magnitude > 5 in the last 7 days. 
    const [geodata, setGeodata] = useState([]); // data used for displaying map. 

    useEffect(()=>{
        // get recent data
        fetch("https://lchsuan.life:3001/api/analytics/recent")
        .then((res) => res.json())
        .then((data)=> {
            // console.log(data.data);
            setRecent_eq(data.data);
        });
        // Get date 14 days before. 
        var Date_before_14 = new Date();
        var Date_before_7 = new Date();
        var Date_before_2 = new Date();

        Date_before_14.setDate(Date_before_14.getDate() - 15);
        Date_before_7.setDate(Date_before_7.getDate() - 8);
        Date_before_2.setDate(Date_before_2.getDate() - 2);

        // get linechart data.
        fetch("https://lchsuan.life:3001/api/analytics/linechart/"+Date_before_14.toISOString().slice(5, 10))
        .then((res) => res.json())
        .then((data)=> {
            data.data[data.data.length -1].x ='Today';
            // console.log(data);
            setEq_chart([{
                id: "No. per day",
                color: tokens("dark").greenAccent[500],
                data: data.data
              }]);
            let sum = 0;
            for(let i = 0; i < data.data.length; i++){
                sum+= Number(data.data[i].y);
            }
            setTotal_14(sum);
            setMag5(data.mag[0].count);
        });
        // Get total numbers of earthquake in 7 days.
        fetch("https://lchsuan.life:3001/api/analytics/linechart/"+Date_before_7.toISOString().slice(5, 10))
        .then((res) => res.json())
        .then((data)=> {
            let sum = 0;
            for(let i = 0; i < data.data.length; i++){
                sum+= Number(data.data[i].y);
            }
            setTotal_7(sum);
        });
        // Get barchart data.
        fetch("https://lchsuan.life:3001/api/analytics/distribution/"+Date_before_7.toISOString().slice(5, 10))
        .then((res) => res.json())
        .then((data)=> {
            setBardata(data.data);
        });

        // Get yesterday data:
        fetch("https://lchsuan.life:3001/api/analytics/yesterday/"+Date_before_2.toISOString().slice(5, 10))
        .then((res) => res.json())
        .then((data)=> {
            // console.log(((data.data[1].total-data.data[0].total)*100/data.data[0].total).toFixed(2));

            // console.log(data.data);
            // Percentage increase/decrease.
            setyesterday(((data.data[1].total-data.data[0].total)*100/data.data[0].total).toFixed(2));

        });

        // Get geo data for map:
        fetch("https://lchsuan.life:3001/api/analytics/geo")
        .then((res) => res.json())
        .then((data)=> {
            setGeodata(data.data);
        });

    }, [])
    

  return (
    <Box m="20px">
    {/* GRID & CHARTS */}
        <Box mb="30px">
            <Typography
                variant="h2"
                color={colors.grey[100]}
                fontWeight="bold"
                sx={{ m: "0 0 5px 0" }}
            >
                Analytics
            </Typography>
            <Typography variant="h5" color={colors.greenAccent[400]}>
                Weekly Trends
            </Typography>
        </Box>
        <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
        >
      {/* ROW 1 */}
      <Box
        gridColumn={isPhoneScreen?"span 12":"span 2"}
        gridRow="span 1"
        backgroundColor={colors.primary[400]}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <StatBox
          title="Last Week"
          subtitle={"Activities " + (total_14-total_7>total_7?"down by":"up by")}
          progress={Math.abs((1 - (total_14-total_7)/total_7)).toString()}
                
          increase={total_14-total_7>total_7?((total_14-total_7)/total_7).toFixed(2)*100-100+"%↓"
            :(100 - (total_14-total_7)/total_7).toFixed(2)*100+"%↑"}
          icon={
            <TodayIcon/>
          }
        />
      </Box> 
      <Box
        gridColumn={isPhoneScreen?"span 12":"span 2"}
        gridRow="span 1"
        backgroundColor={colors.primary[400]}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <StatBox
          title="Yesterday"
          subtitle={"Activities "+ (yesterday>=0?"up by ":"down by ")}
          progress={Math.abs(yesterday/100)}
                
          increase={Math.abs(yesterday).toFixed(1)+(yesterday>=0?"%↑":"%↓")}
          icon={
            <TimelineIcon/>
          }
        />
      </Box>
      <Box
        gridColumn={isPhoneScreen?"span 12":"span 5"}
        gridRow="span 2"
        backgroundColor={colors.primary[400]}
      >
        <Typography
          variant="h5"
          fontWeight="600"
          sx={{ padding: "30px 30px 0 30px" }}
        >
          Magnitude Distributions in the last 7 days
        </Typography>
        <Box height="250px" mt="-20px">
          <BarChart data={bardata} />
        </Box>
      </Box>
      <Box
        gridColumn={isPhoneScreen?"span 12":"span 3"}
        gridRow="span 2"
        backgroundColor={colors.primary[400]}
        padding="30px"
      >
        <Typography
          variant="h5"
          fontWeight="600"
          sx={{ marginBottom: "15px" }}
        >
          Geography
        </Typography>
        <Box height="200px">
          <GeographyChart data={geodata} />
        </Box>
      </Box>
      <Box
        gridColumn={isPhoneScreen?"span 12":"span 4"}
        gridRow="span 1"
        backgroundColor={colors.primary[400]}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <StatBox
          title="Percentage of the earthquakes"
          subtitle={"Where magnitudes larger than 5, in the last two weeks"}
          progress={Math.abs(((mag5)/total_14)).toString()}
                
          increase={Math.abs(((mag5)/total_14).toFixed(2)*100).toString()+"%"}
          icon={
            <Looks5Icon/>
          }
        />
      </Box>
      
      
      

      {/* ROW 2 */}
      <Box
        gridColumn={isPhoneScreen?"span 12":"span 8"}
        gridRow="span 2"
        backgroundColor={colors.primary[400]}
      >
        <Box
          mt="25px"
          p="0 30px"
          display="flex "
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography
              variant="h5"
              fontWeight="600"
              color={colors.grey[100]}
            >
              Total Earthquake Activities in 14 days:
            </Typography>
            <Typography
              variant="h3"
              fontWeight="bold"
              color={colors.greenAccent[500]}
            >
              {total_14}
            </Typography>
          </Box>
        </Box>
        <Box height="250px" m="-20px 0 0 0">
          <LineChart data={eq_chart} />
        </Box>
      </Box>
      <Box
        gridColumn={isPhoneScreen?"span 12":"span 4"}
        gridRow="span 2"
        backgroundColor={colors.primary[400]}
        overflow="auto"
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          borderBottom={`3px solid ${colors.primary[500]}`}
          colors={colors.grey[100]}
          p="15px"
        >
          <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
            Recent Earthquakes
          </Typography>
        </Box>
        {recent_eq.map((eq, i) => (
          <Box
            key={`${eq.time}-${i}`}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`2px solid ${colors.primary[500]}`}
            p="15px"
          >
            <Box>
              <Typography
                color={colors.greenAccent[500]}
                variant="h5"
                fontWeight="600"
              >
                {eq.location.toString().split(",")[1]}
              </Typography>
              <Typography color={colors.grey[100]}>
                {eq.location.toString().split(",")[0]}
              </Typography>
            </Box>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
            >
            <Box color={colors.grey[100]} 
                // justifyContent="right"
            >{
                // eq.time.replace(/[TZ]/g, ', ').slice(0, -6)
                new Date(eq.time).toLocaleString("en-US", {
                    timeZone: "Asia/Singapore",
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour12: false,
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })
            }</Box>
            <Box
              backgroundColor={colors.greenAccent[500]}
              p="5px 10px"
              borderRadius="4px"
              sx={{marginLeft: '15px'}}
            >
              {eq.mag.toFixed(1)}
            </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  </Box>
);

}
