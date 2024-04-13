import {React, useState, useEffect} from 'react';
// import Link, Menu, MenuItem, Toolbar, Typography, useTheme from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import MenuIcon from '@mui/icons-material/Menu';

const pages = ['About'];


export default function Layout(props) {
    const [anchorElNav, setAnchorElNav] = useState(null);

    return (
        <>
            <AppBar position="static" sx={{marginBottom: 1}}>
                <Container maxWidth="xl" >
                    <Toolbar disableGutters>
                    <TravelExploreIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        sx={{
                        mr: 2,
                        display: { xs: 'none', md: 'flex' },
                        fontFamily: 'Roboto',
                        fontWeight: 200,
                        letterSpacing: '.1rem',
                        color: 'inherit',
                        textDecoration: 'none',
                        }}
                    >
                        QuakeSearch
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        
                        <Menu
                        id="menu-appbar"
                        sx={{
                            display: { xs: 'block', md: 'none' },
                        }}
                        >
                        {pages.map((page) => (
                            <MenuItem key={page} onClick={console.log("test")}>
                            <Typography textAlign="center">{page}</Typography>
                            </MenuItem>
                        ))}
                        </Menu>
                    </Box>
                    <TravelExploreIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                        mr: 2,
                        display: { xs: 'flex', md: 'none' },
                        flexGrow: 1,
                        fontFamily: 'roboto',
                        fontWeight: 200,
                        letterSpacing: '.1rem',
                        color: 'inherit',
                        textDecoration: 'none',
                        }}
                    >
                        QuakeSearch
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                        <Button
                            key={page}
                            onClick={console.log("test")}
                            sx={{ my: 1, color: 'white', display: 'block', fontFamily: 'Roboto',}}
                        >
                            {page}
                        </Button>
                        ))}
                    </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </>
    )
}