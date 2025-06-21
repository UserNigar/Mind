import React from 'react';
import Header from '../headercomponent/header/Header';
import { Outlet } from 'react-router-dom';

import Footer from '../footer/Footer';

const Layout = ({ darkMode, setDarkMode }) => {
  return (
    <div>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <Outlet />
      <Footer/>
    </div>
  );
};

export default Layout;
