import React from 'react'
import Logo from '../logo/Logo'
import Navlist from '../navlist/Navlist'
import "./Navbar.css"
import UserBtn from '../loginicon/UserBtn'
import SideBar from '../sidebar/Sidebar'
import Wrapper from '../wrapper/Wrapper'
import CustomizedSwitch from '../../sidebarcomp/Nightbtn/Night'

const Navbar = ({ darkMode, setDarkMode }) => {
  return (
    <div className='navbar'>
        <Logo/>
      <Navlist darkMode={darkMode} />
          {/* <CustomizedSwitch darkMode={darkMode} setDarkMode={setDarkMode} /> */}
         <Wrapper  darkMode={darkMode} setDarkMode={setDarkMode}/>
    </div>
  )
}

export default Navbar