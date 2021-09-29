import React from 'react';

import { Route, BrowserRouter, Switch } from 'react-router-dom';

import {
  Box,
  CssBaseline,
  Toolbar,
} from '@mui/material';

import { Routes } from './routes';
import { Header } from './components/Header';
import { NavContainer } from './components/NavContainer';

const drawerWidth = 240;

function App() {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <BrowserRouter>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <Header drawerWidth={drawerWidth} drawerHandler={handleDrawerToggle} />
        <NavContainer drawerWidth={drawerWidth} drawerHandler={handleDrawerToggle} drawerState={mobileOpen} />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Switch>
            {Routes.map((route: any) => (
              <Route exact path={route.path} key={route.path}>
                <route.screen />
              </Route>
            ))}
          </Switch>
        </Box>
      </Box>
    </BrowserRouter>
  );
}

export default App;
