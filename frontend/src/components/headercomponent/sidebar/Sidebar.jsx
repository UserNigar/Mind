import React, { useState } from 'react';
import {
  Box,
  SwipeableDrawer,
  Button,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';

import CustomizedSwitch from '../../sidebarcomp/Nightbtn/Night';

export default function SideBar({ darkMode, setDarkMode }) {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (state) => () => {
    setOpen(state);
  };

  return (
    <div>
      <Button onClick={toggleDrawer(true)} className="sidebar-btn">
        <MenuIcon sx={{ fontSize: 70, color: darkMode ? 'white' : 'black' }} />
      </Button>
      <SwipeableDrawer
        anchor="left"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        <Box
          sx={{
            width: 280,
            backgroundColor: darkMode ? '#121212' : '#fff',
            color: darkMode ? 'white' : 'black',
            height: '100%'
          }}
          role="presentation"
        >


          <Divider sx={{ 
            backgroundColor: darkMode ? 'rgba(255,255,255,0.2)' 
            : 'rgba(0,0,0,0.1)' }} />

          <List>
            <ListItem>
              jbvjhbgk
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <CustomizedSwitch darkMode={darkMode} setDarkMode={setDarkMode} />
                </ListItemIcon>
                <ListItemText
                  primary="Dark Mode"
                  primaryTypographyProps={{ fontSize: 22, color: darkMode ? 'white' : 'black' }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </SwipeableDrawer>
    </div>
  );
}
