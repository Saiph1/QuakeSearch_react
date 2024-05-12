import React from "react";
import "./index.css";
import App from "./App";
import About from "./about";
import Layout from "./layout";
import Analytics from "./analytics";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./components/theme";
import { Routes, Route } from "react-router-dom";

function Main() {
  const [theme, colorMode] = useMode();
  return (
    <React.StrictMode>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div>
            <Layout />
          </div>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/about" element={<About />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </React.StrictMode>
  );
}

export default Main;
