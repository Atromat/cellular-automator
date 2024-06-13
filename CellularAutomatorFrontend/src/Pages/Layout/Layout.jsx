import React, { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import './Layout.css';

function Layout({isUserSignedIn, setIsUserSignedIn}) {
  const [responsiveToggled, setResponsiveToggled] = useState(false);
  const navigate = useNavigate();

  const handleLogout = (event) => {
    localStorage.removeItem('userToken');
    setIsUserSignedIn(false);
    navigate('/');
  };

  function addActivePageToClassNameIfLocationEqual(location, originalClassName) {
    return useLocation().pathname === location ? originalClassName + ' ActivePage' : originalClassName;
  }

  return (
    <div className="Layout">
      <nav className={ responsiveToggled ? 'Topnav Responsive' : 'Topnav' }>
        <Link to="/" className={addActivePageToClassNameIfLocationEqual('/', 'NavbarLink') + " FirstColumnWidth"} style={{paddingLeft: "0px", paddingRight: "0px" }}>Cellular Automator</Link>
        
        {!isUserSignedIn ? (
          <>
          <Link to="/SignIn" className={addActivePageToClassNameIfLocationEqual('/SignIn', 'NavbarLink')}>Sign In</Link>
          <Link to="/Register" className={addActivePageToClassNameIfLocationEqual('/Register', 'NavbarLink')}>Register</Link>
          </>
        ) : (
          <>
          <Link to="/RuleEditor" className={addActivePageToClassNameIfLocationEqual('/RuleEditor', 'NavbarLink')}>Rule Editor</Link>
          <div className='SignOutDiv NavbarLink' onClick={(e) => handleLogout(e)} >Sign Out</div>
          </>
        )}

        <div className="icon NavbarLink" onClick={(e) => setResponsiveToggled(!responsiveToggled)}>
          <i className="fa fa-bars"></i>
        </div>
      </nav>
      <Outlet />
  </div>
  )
}

export default Layout