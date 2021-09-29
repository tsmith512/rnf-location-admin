import React from 'react';

import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material';

import { Routes } from '../routes';
import { Link } from 'react-router-dom';

interface NavContainerProps {
  drawerState: boolean;
  drawerWidth: number;
  drawerHandler: () => void;
}

const NavDrawer: React.FC = () => (
  <React.Fragment>
    <Toolbar />
    <Divider />
    <List>
      {Routes.map((route: any, index: number) => {
        return (
          <ListItem button key={index} to={route.path} component={Link}>
            <ListItemIcon><route.icon /></ListItemIcon>
            <ListItemText>{route.title}</ListItemText>
          </ListItem>
        );
      })}
    </List>
  </React.Fragment>
);


export const NavContainer: React.FC<NavContainerProps> = (props) => {
  return (
    <Box component="nav" sx={{
      width: { sm: props.drawerWidth },
      flexShrink: { sm: 0 },
    }}>
      <Drawer
        variant="temporary"
        open={props.drawerState}
        onClose={props.drawerHandler}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: props.drawerWidth },
        }}>

        <NavDrawer />

      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: props.drawerWidth },
        }}
        open
      >
        <NavDrawer />
      </Drawer>
    </Box>
  );
}
