import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {createTheme, ThemeProvider} from "@mui/material";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

root.render(<ThemeProvider theme={darkTheme}><App /></ThemeProvider>);


