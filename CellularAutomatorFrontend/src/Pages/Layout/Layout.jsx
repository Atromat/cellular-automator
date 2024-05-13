import React from 'react'
import { Link, Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div className="Layout">
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/RuleEditor">Rule Editor</Link>
          </li>
          <li>
          <Link to="/Login">Login</Link>
          </li>
          <li>
          <Link to="/Register">Register</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
  </div>
  )
}

export default Layout