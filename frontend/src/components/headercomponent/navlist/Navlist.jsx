import { Link } from 'react-router-dom';  // react-router-dom olmalıdır, yoxsa import xəta verər
import React from 'react';
import "./Navlist.css";

const Navlist = ({ darkMode }) => {
  return (
    <ul className={darkMode ? 'navlist navlist-dark' : 'navlist'}>
        <li className='navlist-item'><Link to={"/"}>Haqqında</Link></li>
        <li className='navlist-item'><Link to={"/services"}>Services</Link></li>
        <li className='navlist-item'><Link to={"/about"}>About Us</Link></li>
    </ul>
  );
}

export default Navlist;
