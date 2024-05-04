import { React, useContext } from "react";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import AppBar from "@mui/material/AppBar";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { useNavigate } from "react-router-dom";
import { useTheme, IconButton } from "@mui/material";
import { ColorModeContext, tokens } from "./components/theme";

const pages = ["home", "analytics", "about"];

export default function Layout(props) {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);


  return (
      <AppBar position="static" sx={{ marginBottom: 1, backgroundColor: colors.blueAccent[100]}}>
        <Container maxWidth="xl" >
          <Toolbar disableGutters >
            <TravelExploreIcon
              sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
            />
            <Typography
              variant="h6"
              noWrap
              component="a"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "Roboto",
                fontWeight: 200,
                letterSpacing: ".1rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              QuakeSearch
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <Menu
                id="menu-appbar"
                sx={{
                  display: { xs: "block", md: "none" },
                }}
                open={false}
              >
                {pages.map((page) => (
                  <MenuItem key={page}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Typography
              variant="h5"
              // onClick={()=>navigate('/')}
              noWrap
              component="a"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "roboto",
                fontWeight: 200,
                letterSpacing: ".1rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              QuakeSearch
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={() => navigate("/" + (page === "home" ? "" : page))} //Navigate back to the index or the about page.
                  sx={{
                    my: 0,
                    color: "white",
                    display: "block",
                    fontFamily: "Roboto",
                    fontWeight: 300,
                  }}
                >
                  {page}
                </Button>
              ))}
            </Box>
            <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </IconButton>
          </Toolbar>
        </Container>
      </AppBar>
  );
}
