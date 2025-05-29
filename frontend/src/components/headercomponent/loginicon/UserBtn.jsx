import React from 'react'
import Dropdown from '@mui/joy/Dropdown';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Person from '@mui/icons-material/Person';
import "./UserBtn.css"

const UserBtn = () => {
    return (
        <div>
            <Dropdown>
                <MenuButton sx={{ width: 170 , height: 60 , fontSize:23 }}>
                    <Person sx={{fontSize:35}} />
                    Sign in...
                </MenuButton>
                <Menu>
                    <MenuItem sx={{fontSize:27}}>Profile</MenuItem>
                    <MenuItem sx={{fontSize:27}}>My account</MenuItem>
                    <MenuItem sx={{fontSize:27}}>Logout</MenuItem>
                </Menu>
            </Dropdown>
        </div>
    )
}

export default UserBtn;
