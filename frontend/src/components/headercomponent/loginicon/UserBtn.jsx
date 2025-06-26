import React from 'react';
import Dropdown from '@mui/joy/Dropdown';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Person from '@mui/icons-material/Person';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../../Redux/UserSlice';

// ✅ Əlavə: Link wrapper - `data-*` propların ötürülməsinin qarşısını alır
const LinkBehavior = React.forwardRef(function LinkBehavior(props, ref) {
  return <RouterLink ref={ref} {...props} />;
});

const UserBtn = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.users.currentUser);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div>
      <Dropdown>
        <MenuButton sx={{ width: 140, height: 40, fontSize: 13 }}>
          <Person sx={{ fontSize: 25, mr: 1 }} />
          {currentUser ? currentUser.username : 'Sign in...'}
        </MenuButton>

        <Menu>
          {!currentUser ? (
            <>
              <MenuItem
                sx={{ fontSize: 13 }}
                component={LinkBehavior}
                to="/register"
              >
                Sign up
              </MenuItem>
              <MenuItem
                sx={{ fontSize: 13 }}
                component={LinkBehavior}
                to="/login"
              >
                Log in
              </MenuItem>
            </>
          ) : (
            <>
              <MenuItem sx={{ fontSize: 33 }} onClick={handleLogout}>
                Logout
              </MenuItem>
              <MenuItem
                sx={{ fontSize: 13 }}
                component={LinkBehavior}
                to="/profile"
              >
                Profile
              </MenuItem>
              <MenuItem
                sx={{ fontSize: 13 }}
                component={LinkBehavior}
                to="/chat"
              >
                Chat
              </MenuItem>
            </>
          )}
        </Menu>
      </Dropdown>
    </div>
  );
};

export default UserBtn;
