import React from 'react';
import Dropdown from '@mui/joy/Dropdown';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Person from '@mui/icons-material/Person';
import { Link } from 'react-router-dom';
import './UserBtn.css';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../../Redux/UserSlice';


const UserBtn = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.users.currentUser);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div>
      <Dropdown>
        <MenuButton sx={{ width: 230, height: 70, fontSize: 30 }}>
          <Person sx={{ fontSize: 45 }} />
          {currentUser ? currentUser.username : 'Sign in...'}
        </MenuButton>

        <Menu>
          {!currentUser ? (
            <>
              <MenuItem sx={{ fontSize: 33 }} component={Link} to="/register">
                Sign up
              </MenuItem>
              <MenuItem sx={{ fontSize: 33 }} component={Link} to="/login">
                Log in
              </MenuItem>
            </>
          ) : (
            <>
              <MenuItem sx={{ fontSize: 33 }} onClick={handleLogout}>
                Logout
              </MenuItem>
              <MenuItem sx={{ fontSize: 33 }} component={Link} to="/profile">
                Profile
              </MenuItem>
            </>
          )}
        </Menu>
      </Dropdown>
    </div>
  );
};

export default UserBtn;
