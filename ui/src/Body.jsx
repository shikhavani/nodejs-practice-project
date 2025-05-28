import React from 'react'
import NavBar from './NavBar';
import { Outlet } from 'react-router-dom'
import Footer from './Footer';

const Body = () => {
  return (
    <div>
        <NavBar />
        {/** any childrem components will be rendered here */}
        <Outlet />
        <Footer />
    </div>
  )
}

export default Body;