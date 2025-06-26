import React from 'react'
import UserBtn from '../loginicon/UserBtn'
import SideBar from '../sidebar/Sidebar'
import "./Wrapper.css"
import CustomizedSwitch from '../../sidebarcomp/Nightbtn/Night'

const Wrapper = ({darkMode , setDarkMode}) => {
  return (
    <div className='wrapper'>
        <UserBtn  />
       <div className="toggle">
         <SideBar darkMode={darkMode} setDarkMode={setDarkMode} />
       </div>
    </div>
  )
}

export default Wrapper