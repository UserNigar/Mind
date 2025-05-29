import { Link } from 'react-router-dom'
import React from 'react'
import "./Navlist.css"

const Navlist = () => {
  return (
    <ul className='navlist'>
        <li className='navlist-item'><Link to={"/"}>Home</Link></li>
        <li className='navlist-item'><Link to={"/services"}>Services</Link></li>
        <li className='navlist-item'><Link to={"/about"}>About Us</Link></li>
    </ul>
  )
}

export default Navlist