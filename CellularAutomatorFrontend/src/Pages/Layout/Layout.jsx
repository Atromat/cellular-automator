import React, { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom';
import './Layout.css';

function Layout() {
  const [responsiveToggled, setResponsiveToggled] = useState(false);

  function addActivePageToClassNameIfLocationEqual(location, originalClassName) {
    return useLocation().pathname === location ? originalClassName + ' ActivePage' : originalClassName;
  }

  return (
    <div className="Layout">
      <nav className={ responsiveToggled ? 'Topnav Responsive' : 'Topnav' }>
        <Link to="/" className={addActivePageToClassNameIfLocationEqual('/', 'NavbarLink')}>Cellular Automator</Link>
        <Link to="/RuleEditor" className={addActivePageToClassNameIfLocationEqual('/RuleEditor', 'NavbarLink')}>Rule Editor</Link>
        <Link to="/SignIn" className={addActivePageToClassNameIfLocationEqual('/SignIn', 'NavbarLink')}>Sign In</Link>
        <Link to="/Register" className={addActivePageToClassNameIfLocationEqual('/Register', 'NavbarLink')}>Register</Link>
        <div className="icon NavbarLink" onClick={(e) => setResponsiveToggled(!responsiveToggled)}>
          <i className="fa fa-bars"></i>
        </div>
      </nav>
      <Outlet />
  </div>
  )
}

export default Layout