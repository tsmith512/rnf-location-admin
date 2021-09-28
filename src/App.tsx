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
import HomeIcon from '@mui/icons-material/Home';

import React from 'react';

// @TODO: Temporary. Swap this out with a router.
import Home from './screens/Home';

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
        <ListItem button key={1}>
          <ListItemIcon><HomeIcon /></ListItemIcon>
          <ListItemText>Home</ListItemText>
        </ListItem>
      </List>
    </React.Fragment>
  );

  return (
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
        <Home />
      </Box>
    </Box>
  );
}

export default App;
