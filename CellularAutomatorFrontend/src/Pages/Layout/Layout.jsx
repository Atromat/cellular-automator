import React, { useState } from 'react'
import { Link, Outlet } from 'react-router-dom';
import './Layout.css';

function Layout() {
  const [activePage, setActivePage] = useState('home');
  const [responsiveToggled, setResponsiveToggled] = useState(false);

  return (
    <div className="Layout">
      <nav className={ responsiveToggled ? 'Topnav Responsive' : 'Topnav' }>
        <Link to="/" className='NavbarLink' setActivePage={setActivePage}>Home</Link>
        <Link to="/RuleEditor" className='NavbarLink' setActivePage={setActivePage}>Rule Editor</Link>
        <Link to="/SignIn" className='NavbarLink' setActivePage={setActivePage}>Sign In</Link>
        <Link to="/Register" className='NavbarLink' setActivePage={setActivePage}>Register</Link>
        <a href="javascript:void(0);" className="icon NavbarLink" onClick={(e) => setResponsiveToggled(!responsiveToggled)}>
          <i className="fa fa-bars"></i>
        </a>
      </nav>
      <Outlet />
  </div>
  )
}

export default Layout