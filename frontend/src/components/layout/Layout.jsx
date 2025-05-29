import React from 'react'
import Header from '../headercomponent/header/Header'
import { Outlet } from 'react-router'

const Layout = () => {
  return (
    <div>
        <Header/>
        <Outlet/>
    </div>
  )
}

export default Layout