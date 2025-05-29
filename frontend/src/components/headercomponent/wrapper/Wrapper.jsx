import React from 'react'
import UserBtn from '../loginicon/UserBtn'
import SideBar from '../sidebar/Sidebar'
import "./Wrapper.css"

const Wrapper = () => {
  return (
    <div className='wrapper'>
        <UserBtn/>
        <SideBar/>
    </div>
  )
}

export default Wrapper