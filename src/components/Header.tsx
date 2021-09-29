import React from 'react';

import {
  AppBar,
  IconButton,
  Toolbar,
  Typography
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';

interface HeaderProps {
  drawerWidth: number;
  drawerHandler: () => void;
}

export const Header: React.FC<HeaderProps> = (props) => {
  return (
    <AppBar position="fixed" component="div" sx={{
      width: { sm: `calc(100% - ${props.drawerWidth}px)` },
      ml: { sm: `${props.drawerWidth}px` },
    }}>
      <Toolbar>
        <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={props.drawerHandler}
            sx={{ mr: 2, display: { sm: 'none' } }}>
              <MenuIcon />
        </IconButton>
        <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>RNF Location Admin</Typography>
      </Toolbar>
    </AppBar>
  );
}
