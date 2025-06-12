import React from 'react'
import Navbar from '../navbar/Navbar'

const Header = ({ darkMode, setDarkMode }) => {
  return (
    <div>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode}/>
    </div>
  )
}

export default Header