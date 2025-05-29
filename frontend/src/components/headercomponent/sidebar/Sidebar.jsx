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

import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';

import './Sidebar.css';
import CustomSwitch from '../../sidebarcomp/Nightbtn/Night';

export default function SideBar() {
  const [open, setOpen] = useState(false);

  const openDrawer = () => {
    setOpen(true);
  };

  const closeDrawer = () => {
    setOpen(false);
  };

  return (
    <div>
      {/* Açma düyməsi */}
      <Button onClick={openDrawer} className="sidebar-btn">
        <MenuIcon sx={{ fontSize: 50, color: 'black' }} />
      </Button>

      {/* Çəkilən menyu */}
      <SwipeableDrawer
        anchor="left"
        open={open}
        onClose={closeDrawer}
        onOpen={openDrawer}
      >
        {/* Menyu siyahısı */}
        <Box sx={{ width: 280 }} role="presentation">
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={closeDrawer}>
                <ListItemIcon>
                  <InboxIcon sx={{ fontSize: 30 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Inbox"
                  primaryTypographyProps={{ fontSize: 22 }}
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton onClick={closeDrawer}>
                <ListItemIcon>
                  <MailIcon sx={{ fontSize: 30 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Starred"
                  primaryTypographyProps={{ fontSize: 22 }}
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton onClick={closeDrawer}>
                <ListItemIcon>
                  <InboxIcon sx={{ fontSize: 30 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Send email"
                  primaryTypographyProps={{ fontSize: 22 }}
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton onClick={closeDrawer}>
                <ListItemIcon>
                  <MailIcon sx={{ fontSize: 30 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Drafts"
                  primaryTypographyProps={{ fontSize: 22 }}
                />
              </ListItemButton>
            </ListItem>
          </List>

          <Divider />

          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={closeDrawer}>
                <ListItemIcon>
                  <InboxIcon sx={{ fontSize: 30 }} />
                </ListItemIcon>
                <ListItemText
                  primary="All mail"
                  primaryTypographyProps={{ fontSize: 22 }}
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton onClick={closeDrawer}>
                <ListItemIcon>
                  <MailIcon sx={{ fontSize: 30 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Trash"
                  primaryTypographyProps={{ fontSize: 22 }}
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton onClick={closeDrawer}>
                <ListItemIcon>
                  <InboxIcon sx={{ fontSize: 30 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Spam"
                  primaryTypographyProps={{ fontSize: 22 }}
                />
              </ListItemButton>
            </ListItem>

            {/* Burada drawer bağlanmasın deyə onClick yoxdur */}
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <CustomSwitch />
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{ fontSize: 22 }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </SwipeableDrawer>
    </div>
  );
}
