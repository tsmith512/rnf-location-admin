import React from 'react';

import { Route, BrowserRouter, Switch, Link } from 'react-router-dom';

import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';

import { Routes } from './routes';

const drawerWidth = 240;

function App() {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navDrawer = (
    <React.Fragment>
      <Toolbar />
      <Divider />
      <List>
        {Routes.map((route: any, index: number) => {
          // @TODO: Well this is super gross. Apparently MUI and react-router-dom don't get along
          return (
            <Link to={route.path}>
              <ListItem button key={index}>
                <ListItemIcon><route.icon /></ListItemIcon>
                <ListItemText>{route.title}</ListItemText>
              </ListItem>
            </Link>
          )
        })}
      </List>
    </React.Fragment>
  );

  return (
    <BrowserRouter>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" component="div" sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}>
          <Toolbar>
            <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { sm: 'none' } }}>
                  <MenuIcon />
            </IconButton>
            <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>RNF Location Admin</Typography>
          </Toolbar>
        </AppBar>
        <Box component="nav" sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
        }}>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}>

            {navDrawer}

          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {navDrawer}
          </Drawer>
        </Box>
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
