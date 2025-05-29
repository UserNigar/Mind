import React from 'react'
import Logo from '../logo/Logo'
import Navlist from '../navlist/Navlist'
import "./Navbar.css"
import UserBtn from '../loginicon/UserBtn'
import SideBar from '../sidebar/Sidebar'
import Wrapper from '../wrapper/Wrapper'

const Navbar = () => {
  return (
    <div className='navbar'>
        <Logo/>
        <Navlist/>
        <Wrapper/>

    </div>
  )
}

export default Navbar